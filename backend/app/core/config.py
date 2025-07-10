"""
Application configuration using Pydantic BaseSettings
"""
from typing import List, Optional
from pydantic_settings import BaseSettings
from pydantic import validator, Field
import json
try:
    from pydantic import ConfigDict
    _USE_PYDANTIC_V2 = True
except ImportError:
    _USE_PYDANTIC_V2 = False


class Settings(BaseSettings):
    """Application settings"""
    class Config:
        extra = "allow"
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = True
    
    # Database
    DATABASE_URL: str = Field(default="postgresql+asyncpg://user:password@localhost/reveal_me")
    DATABASE_URL_SYNC: str = Field(default="postgresql://user:password@localhost/reveal_me")  # Use this for Alembic migrations (sync driver)
    
    @validator("DATABASE_URL", pre=True)
    def assemble_database_url(cls, v):
        """Convert sync database URL to async format if needed"""
        if v and not v.startswith("postgresql+asyncpg://"):
            # Replace postgresql:// with postgresql+asyncpg:// for async operations
            return v.replace("postgresql://", "postgresql+asyncpg://", 1)
        return v
    
    # Redis
    REDIS_URL: str = Field(default="redis://localhost:6379")
    
    # JWT
    JWT_SECRET_KEY: str = Field(default="your-secret-key-here")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    
    # CORS
    CORS_ORIGINS: List[str] = Field(default=["http://localhost:5173"])
    
    # Celery
    CELERY_BROKER_URL: str = Field(default="redis://localhost:6379")
    CELERY_RESULT_BACKEND: str = Field(default="redis://localhost:6379")
    
    # Application
    DEBUG: bool = True
    ENVIRONMENT: str = Field(default="development", description="App environment: development, production, test")
    LOG_LEVEL: str = "INFO"
    
    # SpiderFoot
    SPIDERFOOT_URL: str = "http://spiderfoot:8080"
    SPIDERFOOT_API_KEY: str = ""
    
    # Reports
    REPORT_OUTPUT_DIR: str = "/app/reports"
    REPORT_ENCRYPTION_KEY: str = ""
    
    @validator("CORS_ORIGINS", pre=True)
    def assemble_cors_origins(cls, v):
        if isinstance(v, str) and not v.startswith("["):
            return [i.strip() for i in v.split(",")]
        elif isinstance(v, (list, str)):
            return v
        raise ValueError(v)


# Create settings instance
settings = Settings() 