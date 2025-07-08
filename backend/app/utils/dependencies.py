"""
Dependencies for authentication and authorization
"""
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.ext.asyncio import AsyncSession

from app.services.auth import verify_token, get_user_by_id
from app.db.session import get_db
from app.models.user import User
from app.core.config import settings

# OAuth2 scheme for token authentication
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


async def get_current_user(
    token: str = Depends(oauth2_scheme), 
    db: AsyncSession = Depends(get_db)
) -> User:
    """
    Get current authenticated user from JWT token
    
    Args:
        token: JWT access token from Authorization header
        db: Database session
        
    Returns:
        User object if valid token
        
    Raises:
        HTTPException: If token is invalid or user not found
    """
    try:
        # Verify and decode token
        payload = verify_token(token)
        
        # Check token type
        if payload.get("type") != "access":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token type"
            )
        
        # Get user ID from token
        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token payload"
            )
        
        # Get user from database using UUID
        user = await get_user_by_id(db, str(user_id))
        
        if user is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found"
            )
        
        if not bool(user.is_active):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Inactive user"
            )
        
        return user
        
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )


def require_role(required_role: str):
    """
    Dependency factory to require specific user role
    
    Args:
        required_role: Role required to access the endpoint
        
    Returns:
        Dependency function that checks user role
    """
    async def role_checker(user: User = Depends(get_current_user)) -> User:
        """
        Check if user has required role
        
        Args:
            user: Current authenticated user
            
        Returns:
            User object if role check passes
            
        Raises:
            HTTPException: If user lacks required role
        """
        if str(user.role) != required_role:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Insufficient privileges. Required role: {required_role}"
            )
        return user
    
    return role_checker


# Convenience dependencies for common roles
require_admin = require_role("admin")
require_user = require_role("user")
require_viewer = require_role("viewer") 