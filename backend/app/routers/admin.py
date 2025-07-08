"""
Admin router for administrative operations
"""
from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.utils.dependencies import require_admin

router = APIRouter()


@router.get("/users")
async def get_users(
    current_user: dict = Depends(require_admin),
    db: AsyncSession = Depends(get_db)
) -> Any:
    """
    Get all users (admin only)
    """
    # In a real implementation, you would query the database
    # For now, return mock data
    return {
        "users": [
            {
                "id": 1,
                "email": "admin@example.com",
                "username": "admin",
                "full_name": "Administrator",
                "role": "admin",
                "is_active": True
            },
            {
                "id": 2,
                "email": "user@example.com",
                "username": "user",
                "full_name": "Regular User",
                "role": "viewer",
                "is_active": True
            }
        ],
        "total_count": 2
    }


@router.get("/connectors")
async def get_connectors(
    current_user: dict = Depends(require_admin),
    db: AsyncSession = Depends(get_db)
) -> Any:
    """
    Get available connectors (admin only)
    """
    # In a real implementation, you would query the database
    # For now, return mock data
    return {
        "connectors": [
            {
                "id": "spiderfoot",
                "name": "SpiderFoot",
                "description": "OSINT data collection engine",
                "status": "active",
                "version": "4.0",
                "last_check": "2023-12-01T10:00:00Z"
            },
            {
                "id": "nmap",
                "name": "Nmap",
                "description": "Network discovery and security auditing",
                "status": "inactive",
                "version": "7.94",
                "last_check": "2023-11-30T15:30:00Z"
            }
        ],
        "total_count": 2
    } 