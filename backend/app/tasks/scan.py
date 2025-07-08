"""
Scan tasks for Celery background processing
"""
import time
import uuid
from typing import List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import sessionmaker
import os

from app.worker import celery_app
from app.models.scan_job import ScanStatus
from app.models.scan_result import ScanResult
from app.services.scoring import compute_overall_score
from app.db.session import async_engine
from app.services.scan import scan_target_sync
from app.connectors import connectors as CONNECTORS


@celery_app.task(bind=True)
def run_scan(self, target, job_id, target_type, connectors_override=None):
    connectors_to_use = connectors_override or CONNECTORS
    return scan_target_sync(target, connectors_to_use)


@celery_app.task
def cleanup_old_scans():
    """
    Cleanup old scan jobs
    """
    # In a real implementation, you would:
    # 1. Query old scan jobs
    # 2. Delete old scan results
    # 3. Clean up old files
    
    return {"status": "completed", "cleaned_jobs": 0} 