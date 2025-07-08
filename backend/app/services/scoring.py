from typing import List
from app.schemas import ScanFinding


# TODO: load from config or DB table
PENALTY_WEIGHTS = {
    "malware": 30,
    "phishing": 20,
    "spam": 10,
    "vulnerability": 25,
    "exposure": 15,
    "reputation": 5,
    "info": 1,
    "whois": 10,
}


def compute_overall_score(results: list[ScanFinding]) -> float:
    """Return 100 minus sum of penalty weights, capped at 0/100."""
    total_penalty = sum(PENALTY_WEIGHTS.get(r.category, 0) for r in results)
    return max(0.0, 100.0 - total_penalty) 