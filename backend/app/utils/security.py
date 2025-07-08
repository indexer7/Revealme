"""
Security utilities for password hashing and verification
"""
from passlib.context import CryptContext

# Configure password hashing with bcrypt
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(plain: str) -> str:
    """
    Hash a plain text password using bcrypt
    
    Args:
        plain: Plain text password to hash
        
    Returns:
        Hashed password string
    """
    return pwd_context.hash(plain)


def verify_password(plain: str, hashed: str) -> bool:
    """
    Verify a plain text password against its hash
    
    Args:
        plain: Plain text password to verify
        hashed: Hashed password to compare against
        
    Returns:
        True if password matches, False otherwise
    """
    return pwd_context.verify(plain, hashed) 