from abc import ABC, abstractmethod
from typing import Dict


class BaseConnector(ABC):
    """Abstract OSINT connector"""
    
    name: str
    
    @abstractmethod
    async def fetch(self, target: str) -> Dict:
        """Fetch raw data from the OSINT source"""
        pass
    
    @abstractmethod
    def normalize(self, raw: Dict) -> Dict:
        """Normalize raw data to standardized format"""
        pass 