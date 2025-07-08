from .base import BaseConnector
from typing import Dict
from app.schemas import ScanFinding


class WhoisConnector(BaseConnector):
    """WHOIS connector for domain information"""
    
    name = "whois"
    
    async def fetch(self, target: str) -> Dict:
        """Fetch WHOIS data for the target domain"""
        # TODO: call python-whois or external API
        return {"raw": {"domain": target}}
    
    def normalize(self, raw: dict) -> ScanFinding:
        """Normalize WHOIS data to standardized format"""
        # TODO: map raw to standardized fields
        return ScanFinding(category="whois", details=raw) 