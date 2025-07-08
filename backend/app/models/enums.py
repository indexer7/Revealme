"""
Enum definitions for database models
"""
import enum


class UserRole(str, enum.Enum):
    """User role enumeration"""
    admin = "admin"
    viewer = "viewer"


class ScanStatus(str, enum.Enum):
    """Scan job status enumeration"""
    pending = "pending"
    running = "running"
    done = "done"
    failed = "failed" 