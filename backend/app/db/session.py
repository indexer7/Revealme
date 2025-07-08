"""
Database session configuration with SQLAlchemy async support
"""
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker
from typing import AsyncGenerator

from app.core.config import settings
from app.models.base import Base

# Create async engine
async_engine = create_async_engine(
    settings.DATABASE_URL,
    echo=settings.DEBUG,
    pool_pre_ping=True,
    pool_recycle=300,
    future=True,  # Enable SQLAlchemy 2.0 features
)

# Create async session factory
AsyncSessionLocal = sessionmaker(
    class_=AsyncSession,
    expire_on_commit=False
)


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """
    Dependency to get async database session
    """
    session = AsyncSession(bind=async_engine, expire_on_commit=False)
    try:
        yield session
    except Exception:
        await session.rollback()
        raise
    finally:
        await session.close()


async def init_db():
    """
    Initialize database tables
    """
    async with async_engine.begin() as conn:
        # Import all models here to ensure they are registered
        from app.models import User, ScanJob, ScanResult, Report
        
        # Create all tables
        await conn.run_sync(Base.metadata.create_all)


async def close_db():
    """
    Close database connections
    """
    await async_engine.dispose() 