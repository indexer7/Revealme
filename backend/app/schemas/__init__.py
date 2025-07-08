"""
Pydantic schemas for request/response validation
"""

from dataclasses import dataclass
from typing import Any, Dict

__all__ = ["ScanFinding"]

@dataclass
class ScanFinding:
    """Normalized output of every OSINT connector."""
    category: str          # e.g. "whois", "shodan", …
    details: Dict[str, Any] 