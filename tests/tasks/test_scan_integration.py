import pytest
from unittest.mock import MagicMock, AsyncMock
from app.schemas import ScanFinding
from app.services.scan import scan_target
from app.tasks.scan import run_scan


@pytest.mark.asyncio
async def test_scan_task_with_connectors():
    """Test that scan task integrates with connectors and scoring"""
    
    # Create a completely mocked connector object
    mock_connector = MagicMock()
    mock_connector.fetch = AsyncMock(return_value={"raw": {"domain": "example.com"}})
    mock_connector.normalize = MagicMock(return_value=ScanFinding(category="whois", details={"domain": "example.com"}))
    mock_connector.name = "whois"  # Add the name attribute
    
    # Call the pure function directly (async)
    result = await scan_target("example.com", {"whois": mock_connector})
    
    # Check that the task completed successfully
    assert result["status"] == "completed"
    assert result["overall_score"] == 90.0  # 100 - 10 (default penalty)
    assert len(result["results"]) == 1


def test_scan_task_handles_connector_errors():
    """Test that scan task continues when individual connectors fail"""
    
    # Mock a connector that raises an exception
    mock_connector = MagicMock()
    mock_connector.fetch = AsyncMock(side_effect=Exception("Connection failed"))
    mock_connector.normalize = MagicMock(return_value=ScanFinding(category="failing_connector", details={}))
    mock_connector.name = "failing_connector"
    
    import asyncio
    result = asyncio.run(scan_target("example.com", {"failing_connector": mock_connector}))
    
    # Check that the task completed despite connector failure
    assert result["status"] == "completed"
    assert len(result["results"]) == 0


def test_run_scan_celery_wiring():
    result = run_scan.apply(args=["example.com", "jobid", "domain"]).get()
    assert isinstance(result, dict)
    assert "status" in result 