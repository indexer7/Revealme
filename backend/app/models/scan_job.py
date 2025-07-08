"""
ScanJob model for managing scan operations
"""
from sqlalchemy import Column, String, Enum, UUID, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID as PostgresUUID
import sqlalchemy as sql

from app.models.base import Base, TimestampMixin
from app.models.enums import ScanStatus


class ScanJob(Base, TimestampMixin):
    """ScanJob model for tracking scan operations"""
    
    __tablename__ = "scan_jobs"
    
    # Primary key using UUID
    id = Column(
        PostgresUUID(as_uuid=True), 
        primary_key=True, 
        server_default=sql.text("gen_random_uuid()"),
        comment="Unique identifier for the scan job"
    )
    
    # Foreign key to user
    user_id = Column(
        PostgresUUID(as_uuid=True), 
        ForeignKey("users.id", ondelete="CASCADE"), 
        nullable=False,
        comment="ID of the user who created this scan job"
    )
    
    # Scan target and type
    target = Column(
        String, 
        nullable=False,
        comment="Target domain or email for scanning"
    )
    
    scan_type = Column(
        String, 
        nullable=False,
        comment="Type of scan to perform (domain, email, etc.)"
    )
    
    # Scan status
    status = Column(
        Enum(ScanStatus), 
        nullable=False, 
        default=ScanStatus.pending,
        comment="Current status of the scan job"
    )
    
    # Progress tracking
    progress = Column(
        String, 
        default="0",
        comment="Scan progress as percentage"
    )
    
    # Relationships
    user = relationship(
        "User", 
        back_populates="scan_jobs"
    )
    
    results = relationship(
        "ScanResult", 
        back_populates="job", 
        cascade="all, delete-orphan"
    )
    
    report = relationship(
        "Report", 
        back_populates="job", 
        uselist=False,
        cascade="all, delete-orphan"
    ) 