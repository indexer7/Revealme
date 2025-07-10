from typing import Dict
from pydantic import BaseModel, Field

# Input model according to PRD weights and flags
class ScoringInput(BaseModel):
    # D1: Domain Footprint (max 10)
    subdomain_count: int = Field(..., ge=0)
    has_spf_dkim: bool
    domain_expiry_days: int = Field(..., ge=0)
    privacy_enabled: bool
    whois_email_exposed: bool

    # D2: Breach & Credential Exposure (max 25)
    breach_instances: int = Field(..., ge=0)
    password_exposed: bool
    credential_reuse: bool
    leaked_in_code: bool
    unique_emails_exposed: int = Field(..., ge=0)

    # D3: Infrastructure & Network (max 20)
    open_ports_count: int = Field(..., ge=0)
    has_waf: bool
    infra_outdated: bool
    vulnerable_services_count: int = Field(..., ge=0)
    cdn_bypass_detected: bool

    # D4: Application/Website Risk (max 20)
    outdated_cms: bool
    missing_security_headers: bool
    known_cve_count: int = Field(..., ge=0)
    public_repo_leaks_count: int = Field(..., ge=0)
    exploit_tech_count: int = Field(..., ge=0)

    # D5: Social & OSINT Intelligence (max 15)
    employee_emails_exposed: bool
    public_org_leaks_count: int = Field(..., ge=0)
    used_in_phishing: bool
    predictable_pattern: bool

    # D6: Threat Intelligence / Dark Web (max 10)
    seen_in_marketplaces: bool
    underground_mentions_count: int = Field(..., ge=0)
    ioc_match_count: int = Field(..., ge=0)

class ScoringResult(BaseModel):
    deductions: Dict[str, float]
    total_deduction: float
    score: float

def calculate_oes(input: ScoringInput) -> ScoringResult:
    """
    Compute OES = 100 - (D1 + D2 + D3 + D4 + D5 + D6)
    Penalty breakdown and caps per PRD:
      D1 (10), D2 (25), D3 (20), D4 (20), D5 (15), D6 (10)
    """
    # D1: Domain Footprint (max 10 points)
    d1 = 0
    if input.subdomain_count > 50: d1 += 2
    if not input.has_spf_dkim:      d1 += 3
    if input.domain_expiry_days < 30: d1 += 2
    if not input.privacy_enabled:   d1 += 2
    if input.whois_email_exposed:   d1 += 1
    d1 = min(d1, 10)

    # D2: Breach & Credential Exposure (max 25 points)
    d2 = input.breach_instances * 2
    if input.password_exposed:      d2 += 5
    if input.credential_reuse:       d2 += 3
    if input.leaked_in_code:         d2 += 5
    if input.unique_emails_exposed > 10:
        d2 += 10
    d2 = min(d2, 25)

    # D3: Infrastructure & Network (max 20 points)
    d3 = 0
    d3 += min(input.open_ports_count, 1) * 5
    if not input.has_waf:           d3 += 2
    if input.infra_outdated:        d3 += 3
    d3 += min(input.vulnerable_services_count, 1) * 5
    if input.cdn_bypass_detected:    d3 += 5
    d3 = min(d3, 20)

    # D4: Application/Website Risk (max 20 points)
    d4 = 0
    if input.outdated_cms:          d4 += 5
    if input.missing_security_headers: d4 += 3
    d4 += min(input.known_cve_count, 1) * 5
    d4 += min(input.public_repo_leaks_count, 1) * 4
    d4 += min(input.exploit_tech_count, 1) * 3
    d4 = min(d4, 20)

    # D5: Social & OSINT Intelligence (max 15 points)
    d5 = 0
    if input.employee_emails_exposed: d5 += 5
    d5 += min(input.public_org_leaks_count, 1) * 4
    if input.used_in_phishing:       d5 += 3
    if input.predictable_pattern:    d5 += 3
    d5 = min(d5, 15)

    # D6: Threat Intelligence / Dark Web (max 10 points)
    d6 = 0
    if input.seen_in_marketplaces:   d6 += 5
    d6 += min(input.underground_mentions_count, 1) * 3
    d6 += min(input.ioc_match_count, 1) * 2
    d6 = min(d6, 10)

    total = d1 + d2 + d3 + d4 + d5 + d6
    score = max(0, 100 - total)

    return ScoringResult(
      deductions={'D1': d1,'D2': d2,'D3': d3,'D4': d4,'D5': d5,'D6': d6},
      total_deduction=total,
      score=score
    ) 