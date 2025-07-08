"""
ScanResult model for storing scan findings
"""
from sqlalchemy import Column, String, Float, UUID, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID as PostgresUUID, JSONB
import sqlalchemy as sql

from app.models.base import Base, TimestampMixin


class ScanResult(Base, TimestampMixin):
    """ScanResult model for storing individual scan findings"""
    
    __tablename__ = "scan_results"
    
    # Primary key using UUID
    id = Column(
        PostgresUUID(as_uuid=True), 
        primary_key=True, 
        server_default=sql.text("gen_random_uuid()"),
        comment="Unique identifier for the scan result"
    )
    
    # Foreign key to scan job
    job_id = Column(
        PostgresUUID(as_uuid=True), 
        ForeignKey("scan_jobs.id", ondelete="CASCADE"), 
        nullable=False,
        comment="ID of the scan job this result belongs to"
    )
    
    # Result details
    domain_or_email = Column(
        String, 
        nullable=False,
        comment="Domain or email address that was scanned"
    )
    
    category = Column(
        String, 
        nullable=False,
        comment="Category of the finding (vulnerability, info, etc.)"
    )
    
    # Raw data from OSINT tools
    raw_data = Column(
        JSONB, 
        nullable=False,
        comment="Raw JSON data from the OSINT tool"
    )
    
    # Scoring
    penalty_score = Column(
        Float, 
        nullable=False,
        comment="Penalty score for this finding (0-100)"
    )
    
    # Relationships
    job = relationship(
        "ScanJob", 
        back_populates="results"
    ) 