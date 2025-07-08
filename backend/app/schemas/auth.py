"""
Pydantic schemas for authentication
"""
from pydantic import BaseModel, EmailStr
from typing import Optional


class LoginRequest(BaseModel):
    """Login request schema"""
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    """Token response schema"""
    access_token: str
    token_type: str = "bearer"


class RefreshResponse(BaseModel):
    """Refresh token response schema"""
    access_token: str


class UserCreate(BaseModel):
    """User creation request schema"""
    email: EmailStr
    password: str
    role: Optional[str] = "user"


class UserResponse(BaseModel):
    """User response schema"""
    id: str
    email: str
    role: str
    is_active: bool
    
    class Config:
        from_attributes = True


class UserProfile(BaseModel):
    """User profile schema"""
    id: str
    email: str
    role: str
    is_active: bool
    created_at: Optional[str] = None
    last_login: Optional[str] = None
    
    class Config:
        from_attributes = True 