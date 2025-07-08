"""
Report model for storing generated reports
"""
from sqlalchemy import Column, String, Float, UUID, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID as PostgresUUID, JSONB
import sqlalchemy as sql

from app.models.base import Base, TimestampMixin


class Report(Base, TimestampMixin):
    """Report model for storing generated scan reports"""
    
    __tablename__ = "reports"
    
    # Primary key using UUID
    id = Column(
        PostgresUUID(as_uuid=True), 
        primary_key=True, 
        server_default=sql.text("gen_random_uuid()"),
        comment="Unique identifier for the report"
    )
    
    # Foreign key to scan job
    job_id = Column(
        PostgresUUID(as_uuid=True), 
        ForeignKey("scan_jobs.id", ondelete="CASCADE"), 
        nullable=False,
        comment="ID of the scan job this report belongs to"
    )
    
    # Report file paths
    pdf_path = Column(
        String, 
        nullable=False,
        comment="Path to the generated PDF report file"
    )
    
    html_path = Column(
        String, 
        nullable=False,
        comment="Path to the generated HTML report file"
    )
    
    # Report scoring
    overall_score = Column(
        Float, 
        nullable=False,
        comment="Overall risk score for the scan (0-100)"
    )
    
    # Report metadata (renamed to avoid conflict)
    report_metadata = Column(
        JSONB,
        comment="Report metadata (scores, findings count, etc.)"
    )
    
    # Relationships
    job = relationship(
        "ScanJob", 
        back_populates="report"
    ) 