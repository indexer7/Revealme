"""
User model for authentication and authorization
"""
from sqlalchemy import Column, String, Enum, UUID, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID as PostgresUUID
import sqlalchemy as sql

from app.models.base import Base, TimestampMixin
from app.models.enums import UserRole


class User(Base, TimestampMixin):
    """User model for storing user information and authentication"""
    
    __tablename__ = "users"
    
    # Primary key using UUID
    id = Column(
        PostgresUUID(as_uuid=True), 
        primary_key=True, 
        server_default=sql.text("gen_random_uuid()"),
        comment="Unique identifier for the user"
    )
    
    # User credentials
    email = Column(
        String(320), 
        unique=True, 
        nullable=False, 
        index=True,
        comment="User's email address (unique)"
    )
    
    hashed_password = Column(
        String, 
        nullable=False,
        comment="Hashed password for authentication"
    )
    
    # User role for authorization
    role = Column(
        Enum(UserRole), 
        nullable=False, 
        default=UserRole.viewer,
        comment="User's role for access control"
    )
    
    # User status
    is_active = Column(
        Boolean,
        nullable=False,
        default=True,
        comment="Whether the user account is active"
    )
    
    # Relationships
    scan_jobs = relationship(
        "ScanJob", 
        back_populates="user", 
        cascade="all, delete-orphan"
    ) 