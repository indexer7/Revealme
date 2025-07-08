"""
Scan service for managing scan operations
"""
from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
import uuid
import time
import asyncio
import logging

from app.models.scan_job import ScanJob, ScanStatus
from app.models.scan_result import ScanResult
from app.worker import celery_app
from app.schemas import ScanFinding
from app.services.scoring import compute_overall_score


class ScanService:
    """Scan service for managing scan operations"""
    
    async def start_scan(
        self, 
        target: str, 
        scan_type: str, 
        user_id: str, 
        db: AsyncSession
    ) -> ScanJob:
        """
        Start a new scan job
        """
        # Create scan job record
        job_id = str(uuid.uuid4())
        scan_job = ScanJob(
            job_id=job_id,
            target=target,
            scan_type=scan_type,
            status=ScanStatus.pending,
            user_id=user_id
        )
        
        db.add(scan_job)
        await db.commit()
        await db.refresh(scan_job)
        
        # Enqueue Celery task
        celery_app.send_task(
            "app.tasks.scan.run_scan",
            args=[target, job_id, scan_type]
        )
        
        return scan_job
    
    async def get_scan_status(
        self, 
        job_id: str, 
        db: AsyncSession
    ) -> Optional[ScanJob]:
        """
        Get scan job status
        """
        # In a real implementation, you would query the database
        # For now, return mock data
        return ScanJob(
            id=str(uuid.uuid4()),
            job_id=job_id,
            target="example.com",
            scan_type="domain",
            status=ScanStatus.done,
            progress="100",
            user_id=str(uuid.uuid4())
        )
    
    async def get_scan_results(
        self, 
        job_id: str, 
        db: AsyncSession
    ) -> List[ScanResult]:
        """
        Get scan results
        """
        # In a real implementation, you would query the database
        # For now, return mock data
        return [
            ScanResult(
                id=str(uuid.uuid4()),
                job_id=job_id,
                domain_or_email="example.com",
                category="vulnerability",
                raw_data={"port": 80, "status": "open"},
                penalty_score=50.0
            ),
            ScanResult(
                id=str(uuid.uuid4()),
                job_id=job_id,
                domain_or_email="example.com",
                category="vulnerability",
                raw_data={"cert_expiry": "2023-01-01", "status": "expired"},
                penalty_score=80.0
            )
        ]
    
    async def update_scan_status(
        self, 
        job_id: str, 
        status: ScanStatus, 
        progress: int = 0,
        result_summary: Optional[str] = None,
        error_message: Optional[str] = None,
        db: Optional[AsyncSession] = None
    ) -> None:
        """
        Update scan job status
        """
        # In a real implementation, you would update the database
        pass 

def logger():
    return logging.getLogger("scan")

async def scan_target(target: str, connectors: dict):
    findings: list[ScanFinding] = []
    async def _run(conn):
        raw = await conn.fetch(target)
        return conn.normalize(raw)
    coros = [_run(c) for c in connectors.values()]
    for coro in asyncio.as_completed(coros):
        try:
            findings.append(await coro)
        except Exception as exc:
            logger().exception("Error in connector %s", getattr(exc, "name", "unknown"))
    overall = compute_overall_score(findings)
    return {"status": "completed", "overall_score": overall, "results": findings}

def scan_target_sync(*args, **kw):
    return asyncio.run(scan_target(*args, **kw)) 