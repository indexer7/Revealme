"""
Reports router for report management and download
"""
from typing import Any
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import FileResponse
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.utils.dependencies import get_current_user
from app.services.report import ReportService

router = APIRouter()


@router.get("/{job_id}")
async def get_report_metadata(
    job_id: str,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
) -> Any:
    """
    Get report metadata
    """
    report_service = ReportService()
    
    # Get report metadata
    report = await report_service.get_report_metadata(job_id, db)
    if not report:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Report not found"
        )
    
    return {
        "job_id": job_id,
        "title": report.title,
        "description": report.description,
        "report_type": report.report_type,
        "is_generated": report.is_generated,
        "file_size": report.file_size,
        "created_at": report.created_at,
        "generated_at": report.generated_at,
        "expires_at": report.expires_at,
        "metadata": report.metadata
    }


@router.get("/{job_id}/download")
async def download_report(
    job_id: str,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
) -> Any:
    """
    Download report file
    """
    report_service = ReportService()
    
    # Get report file
    report_file = await report_service.get_report_file(job_id, db)
    if not report_file:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Report file not found"
        )
    
    # Return file response
    return FileResponse(
        path=report_file["path"],
        filename=report_file["filename"],
        media_type="application/pdf" if report_file["type"] == "pdf" else "application/octet-stream"
    )


@router.post("/{job_id}/generate")
async def generate_report(
    job_id: str,
    report_type: str = "pdf",
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
) -> Any:
    """
    Generate report for scan job
    """
    report_service = ReportService()
    
    # Generate report
    report = await report_service.generate_report(job_id, report_type, db)
    
    return {
        "job_id": job_id,
        "report_id": report.uuid,
        "status": "generating",
        "message": "Report generation started"
    } 