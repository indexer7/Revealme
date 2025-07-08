"""
Scans router for managing scan operations
"""
from typing import Any
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.utils.dependencies import get_current_user, require_user
from app.services.scan import ScanService
from app.models.user import User

router = APIRouter()


@router.post("/")
async def create_scan(
    target: str,
    scan_type: str = "domain",
    current_user: User = Depends(require_user),
    db: AsyncSession = Depends(get_db)
) -> Any:
    """
    Create a new scan job
    """
    scan_service = ScanService()
    
    # Enqueue scan task
    job = await scan_service.start_scan(target, scan_type, str(current_user.id), db)
    
    return {
        "job_id": job.job_id,
        "status": job.status,
        "target": job.target,
        "scan_type": job.scan_type,
        "message": "Scan job created successfully"
    }


@router.get("/{job_id}")
async def get_scan_status(
    job_id: str,
    current_user: User = Depends(require_user),
    db: AsyncSession = Depends(get_db)
) -> Any:
    """
    Get scan job status
    """
    scan_service = ScanService()
    
    # Get job status
    job = await scan_service.get_scan_status(job_id, db)
    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Scan job not found"
        )
    
    return {
        "job_id": job.job_id,
        "status": job.status,
        "progress": job.progress,
        "target": job.target,
        "scan_type": job.scan_type,
        "created_at": job.created_at,
        "started_at": job.started_at,
        "completed_at": job.completed_at,
        "result_summary": job.result_summary,
        "error_message": job.error_message
    }


@router.get("/{job_id}/results")
async def get_scan_results(
    job_id: str,
    current_user: User = Depends(require_user),
    db: AsyncSession = Depends(get_db)
) -> Any:
    """
    Get scan results
    """
    scan_service = ScanService()
    
    # Get scan results
    results = await scan_service.get_scan_results(job_id, db)
    
    return {
        "job_id": job_id,
        "results": results,
        "total_count": len(results)
    } 