import pytest
from app.services.scoring import compute_overall_score


def test_empty_results():
    """Test scoring with empty results list"""
    assert compute_overall_score([]) == 100


def test_single_penalty():
    """Test scoring with a single penalty result"""
    class Dummy:
        def __init__(self):
            self.category = "malware"
    
    assert compute_overall_score([Dummy()]) == 70


def test_multiple_penalties_cap():
    """Test scoring with multiple penalties that should cap at 0"""
    class Dummy:
        def __init__(self, cat):
            self.category = cat
    
    results = [Dummy("malware"), Dummy("phishing"), Dummy("spam")]
    expected_score = max(0, 100 - (30 + 20 + 10))
    assert compute_overall_score(results) == expected_score 