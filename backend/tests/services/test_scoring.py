import pytest
from app.services.scoring import ScoringInput, calculate_oes

def test_perfect_score():
    """Test that a perfect input results in a score of 100"""
    input_data = ScoringInput(
        # D1: Domain Footprint
        subdomain_count=10,
        has_spf_dkim=True,
        domain_expiry_days=365,
        privacy_enabled=True,
        whois_email_exposed=False,
        
        # D2: Breach & Credential Exposure
        breach_instances=0,
        password_exposed=False,
        credential_reuse=False,
        leaked_in_code=False,
        unique_emails_exposed=0,
        
        # D3: Infrastructure & Network
        open_ports_count=0,
        has_waf=True,
        infra_outdated=False,
        vulnerable_services_count=0,
        cdn_bypass_detected=False,
        
        # D4: Application/Website Risk
        outdated_cms=False,
        missing_security_headers=False,
        known_cve_count=0,
        public_repo_leaks_count=0,
        exploit_tech_count=0,
        
        # D5: Social & OSINT Intelligence
        employee_emails_exposed=False,
        public_org_leaks_count=0,
        used_in_phishing=False,
        predictable_pattern=False,
        
        # D6: Threat Intelligence / Dark Web
        seen_in_marketplaces=False,
        underground_mentions_count=0,
        ioc_match_count=0
    )
    
    result = calculate_oes(input_data)
    assert result.score == 100.0
    assert result.total_deduction == 0.0
    assert all(deduction == 0.0 for deduction in result.deductions.values())

def test_high_risk_score():
    """Test that high-risk inputs result in low scores"""
    input_data = ScoringInput(
        # D1: Domain Footprint - multiple issues
        subdomain_count=100,  # +2
        has_spf_dkim=False,   # +3
        domain_expiry_days=5, # +2
        privacy_enabled=False, # +2
        whois_email_exposed=True, # +1
        # D1 total: 10 (capped)
        
        # D2: Breach & Credential Exposure - severe issues
        breach_instances=15,  # 15 * 2 = 30 (capped at 25)
        password_exposed=True, # +5
        credential_reuse=True, # +3
        leaked_in_code=True,  # +5
        unique_emails_exposed=50, # +10
        # D2 total: 25 (capped)
        
        # D3: Infrastructure & Network
        open_ports_count=5,   # +5
        has_waf=False,        # +2
        infra_outdated=True,  # +3
        vulnerable_services_count=3, # +5
        cdn_bypass_detected=True, # +5
        # D3 total: 20 (capped)
        
        # D4: Application/Website Risk
        outdated_cms=True,    # +5
        missing_security_headers=True, # +3
        known_cve_count=5,    # +5
        public_repo_leaks_count=3, # +4
        exploit_tech_count=2, # +3
        # D4 total: 20 (capped)
        
        # D5: Social & OSINT Intelligence
        employee_emails_exposed=True, # +5
        public_org_leaks_count=5, # +4
        used_in_phishing=True, # +3
        predictable_pattern=True, # +3
        # D5 total: 15 (capped)
        
        # D6: Threat Intelligence / Dark Web
        seen_in_marketplaces=True, # +5
        underground_mentions_count=5, # +3
        ioc_match_count=3, # +2
        # D6 total: 10 (capped)
    )
    
    result = calculate_oes(input_data)
    # Total deductions: 10 + 25 + 20 + 20 + 15 + 10 = 100
    assert result.score == 0.0
    assert result.total_deduction == 100.0
    assert result.deductions['D1'] == 10.0
    assert result.deductions['D2'] == 25.0
    assert result.deductions['D3'] == 20.0
    assert result.deductions['D4'] == 20.0
    assert result.deductions['D5'] == 15.0
    assert result.deductions['D6'] == 10.0

def test_medium_risk_score():
    """Test a medium-risk scenario"""
    input_data = ScoringInput(
        # D1: Some issues
        subdomain_count=30,
        has_spf_dkim=True,
        domain_expiry_days=60,
        privacy_enabled=True,
        whois_email_exposed=False,
        
        # D2: Some exposure
        breach_instances=2,
        password_exposed=False,
        credential_reuse=True,
        leaked_in_code=False,
        unique_emails_exposed=5,
        
        # D3: Some infrastructure issues
        open_ports_count=1,
        has_waf=True,
        infra_outdated=False,
        vulnerable_services_count=0,
        cdn_bypass_detected=False,
        
        # D4: Some application issues
        outdated_cms=False,
        missing_security_headers=True,
        known_cve_count=1,
        public_repo_leaks_count=0,
        exploit_tech_count=0,
        
        # D5: Some social issues
        employee_emails_exposed=False,
        public_org_leaks_count=1,
        used_in_phishing=False,
        predictable_pattern=False,
        
        # D6: Some threat intel
        seen_in_marketplaces=False,
        underground_mentions_count=0,
        ioc_match_count=1,
    )
    
    result = calculate_oes(input_data)
    # Expected deductions:
    # D1: 0 (no issues)
    # D2: 2*2 + 3 + 0 = 7
    # D3: 5 + 0 + 0 + 0 + 0 = 5
    # D4: 0 + 3 + 5 + 0 + 0 = 8
    # D5: 0 + 4 + 0 + 0 = 4
    # D6: 0 + 0 + 2 = 2
    # Total: 26
    expected_score = 100 - 26
    assert result.score == expected_score
    assert result.total_deduction == 26.0

def test_deduction_caps():
    """Test that deductions are properly capped at their maximums"""
    input_data = ScoringInput(
        # D2: Test breach instances cap (25 max)
        subdomain_count=0,
        has_spf_dkim=True,
        domain_expiry_days=365,
        privacy_enabled=True,
        whois_email_exposed=False,
        
        breach_instances=20,  # 20 * 2 = 40, should cap at 25
        password_exposed=False,
        credential_reuse=False,
        leaked_in_code=False,
        unique_emails_exposed=0,
        
        open_ports_count=0,
        has_waf=True,
        infra_outdated=False,
        vulnerable_services_count=0,
        cdn_bypass_detected=False,
        
        outdated_cms=False,
        missing_security_headers=False,
        known_cve_count=0,
        public_repo_leaks_count=0,
        exploit_tech_count=0,
        
        employee_emails_exposed=False,
        public_org_leaks_count=0,
        used_in_phishing=False,
        predictable_pattern=False,
        
        seen_in_marketplaces=False,
        underground_mentions_count=0,
        ioc_match_count=0,
    )
    
    result = calculate_oes(input_data)
    assert result.deductions['D2'] == 25.0  # Should be capped at 25
    assert result.score == 75.0  # 100 - 25 