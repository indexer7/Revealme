import pytest
from app.connectors import connectors
from app.connectors.whois import WhoisConnector


@pytest.mark.asyncio
async def test_loader_registers_whois():
    """Test that the connector loader registers the whois connector"""
    assert "whois" in connectors
    inst = connectors["whois"]
    assert isinstance(inst, WhoisConnector)


@pytest.mark.asyncio
async def test_whois_fetch_and_normalize():
    """Test that the whois connector can fetch and normalize data"""
    inst = connectors["whois"]
    raw = await inst.fetch("example.com")
    norm = inst.normalize(raw)
    assert norm.details["raw"]["domain"] == "example.com" 