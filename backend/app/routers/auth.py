"""
Authentication router with login, refresh, and user management endpoints
"""
from fastapi import APIRouter, Depends, HTTPException, status, Response, Cookie
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional

from app.db.session import get_db
from app.services.auth import (
    authenticate_user, 
    create_access_token, 
    create_refresh_token, 
    verify_token,
    create_user,
    get_user_by_email
)
from app.utils.dependencies import get_current_user, require_admin
from app.schemas.auth import (
    LoginRequest, 
    TokenResponse, 
    RefreshResponse, 
    UserCreate, 
    UserResponse,
    UserProfile
)
from app.models.user import User

router = APIRouter(prefix="", tags=["authentication"])


@router.post("/login", response_model=TokenResponse)
async def login(
    login_data: LoginRequest,
    response: Response,
    db: AsyncSession = Depends(get_db)
):
    """
    Authenticate user and issue access/refresh tokens
    
    Security features:
    - Access token returned in JSON response
    - Refresh token stored in secure HTTP-only cookie
    - Password verification using bcrypt
    """
    # Authenticate user
    user = await authenticate_user(db, login_data.email, login_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Check if user is active
    if not bool(user.is_active):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Inactive user account"
        )
    
    # Create token data
    token_data = {
        "sub": str(user.id),
        "email": user.email,
        "role": user.role
    }
    
    # Create access token
    access_token = create_access_token(token_data)
    
    # Create refresh token
    refresh_token = create_refresh_token(token_data)
    
    # Set refresh token in secure HTTP-only cookie
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,  # Prevent XSS attacks
        secure=True,    # Only sent over HTTPS
        samesite="lax", # CSRF protection
        max_age=7 * 24 * 60 * 60  # 7 days
    )
    
    return TokenResponse(access_token=access_token)


@router.post("/refresh", response_model=RefreshResponse)
async def refresh_token(
    response: Response,
    refresh_token: Optional[str] = Cookie(None),
    db: AsyncSession = Depends(get_db)
):
    """
    Refresh access token using refresh token from cookie
    
    Security features:
    - Refresh token read from secure HTTP-only cookie
    - New access token issued with same user claims
    - Token validation and expiration checking
    """
    if not refresh_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh token not found"
        )
    
    try:
        # Verify refresh token
        payload = verify_token(refresh_token)
        
        # Check token type
        if payload.get("type") != "refresh":
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
        from sqlalchemy import select
        result = await db.execute(select(User).where(User.id == user_id))
        user = result.scalar_one_or_none()
        
        if not user or not bool(user.is_active):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found or inactive"
            )
        
        # Create new access token
        token_data = {
            "sub": str(user.id),
            "email": user.email,
            "role": user.role
        }
        new_access_token = create_access_token(token_data)
        
        # Create new refresh token and update cookie
        new_refresh_token = create_refresh_token(token_data)
        response.set_cookie(
            key="refresh_token",
            value=new_refresh_token,
            httponly=True,
            secure=True,
            samesite="lax",
            max_age=7 * 24 * 60 * 60
        )
        
        return RefreshResponse(access_token=new_access_token)
        
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token"
        )


@router.post("/logout")
async def logout(response: Response):
    """
    Logout user by clearing refresh token cookie
    
    Security features:
    - Clears refresh token from secure cookie
    - Client should also discard access token
    """
    response.delete_cookie(
        key="refresh_token",
        httponly=True,
        secure=True,
        samesite="lax"
    )
    return {"message": "Successfully logged out"}


@router.post("/register", response_model=UserResponse)
async def register(
    user_data: UserCreate,
    db: AsyncSession = Depends(get_db)
):
    """
    Register a new user account
    
    Security features:
    - Password hashing using bcrypt
    - Email uniqueness validation
    - Role assignment with defaults
    """
    # Check if user already exists
    existing_user = await get_user_by_email(db, user_data.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create new user
    user = await create_user(
        db=db,
        email=user_data.email,
        password=user_data.password,
        role=user_data.role or "viewer"
    )
    
    return UserResponse(
        id=str(user.id),
        email=str(user.email),
        role=str(user.role),
        is_active=bool(user.is_active)
    )


@router.get("/me", response_model=UserProfile)
async def get_current_user_profile(
    current_user: User = Depends(get_current_user)
):
    """
    Get current user profile
    
    Security features:
    - Requires valid access token
    - Returns only current user's data
    """
    return UserProfile(
        id=str(current_user.id),
        email=str(current_user.email),
        role=str(current_user.role),
        is_active=bool(current_user.is_active),
        created_at=str(current_user.created_at) if current_user.created_at else None,
        last_login=str(current_user.last_login) if current_user.last_login else None
    )


@router.get("/users", response_model=list[UserResponse])
async def get_users(
    current_user: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db)
):
    """
    Get all users (admin only)
    
    Security features:
    - Requires admin role
    - Returns user list for administration
    """
    from sqlalchemy import select
    result = await db.execute(select(User))
    users = result.scalars().all()
    
    return [
        UserResponse(
            id=str(user.id),
            email=str(user.email),
            role=str(user.role),
            is_active=bool(user.is_active)
        )
        for user in users
    ] 