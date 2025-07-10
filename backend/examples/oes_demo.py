#!/usr/bin/env python3
"""
OES Engine Demo Script

This script demonstrates the Overall Exposure Score (OES) engine
with different risk scenarios.
"""

import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

from app.services.scoring import ScoringInput, calculate_oes

def demo_perfect_score():
    """Demonstrate a perfect security score"""
    print("🔒 PERFECT SECURITY SCENARIO")
    print("=" * 50)
    
    input_data = ScoringInput(
        # D1: Domain Footprint - All good
        subdomain_count=5,
        has_spf_dkim=True,
        domain_expiry_days=365,
        privacy_enabled=True,
        whois_email_exposed=False,
        
        # D2: Breach & Credential Exposure - Clean
        breach_instances=0,
        password_exposed=False,
        credential_reuse=False,
        leaked_in_code=False,
        unique_emails_exposed=0,
        
        # D3: Infrastructure & Network - Secure
        open_ports_count=0,
        has_waf=True,
        infra_outdated=False,
        vulnerable_services_count=0,
        cdn_bypass_detected=False,
        
        # D4: Application/Website Risk - Up to date
        outdated_cms=False,
        missing_security_headers=False,
        known_cve_count=0,
        public_repo_leaks_count=0,
        exploit_tech_count=0,
        
        # D5: Social & OSINT Intelligence - Private
        employee_emails_exposed=False,
        public_org_leaks_count=0,
        used_in_phishing=False,
        predictable_pattern=False,
        
        # D6: Threat Intelligence / Dark Web - Clean
        seen_in_marketplaces=False,
        underground_mentions_count=0,
        ioc_match_count=0
    )
    
    result = calculate_oes(input_data)
    print(f"OES Score: {result.score}/100")
    print(f"Total Deductions: {result.total_deduction}")
    print("Category Breakdown:")
    for category, deduction in result.deductions.items():
        print(f"  {category}: {deduction}")
    print()

def demo_high_risk_score():
    """Demonstrate a high-risk scenario"""
    print("🚨 HIGH RISK SCENARIO")
    print("=" * 50)
    
    input_data = ScoringInput(
        # D1: Domain Footprint - Multiple issues
        subdomain_count=100,  # Too many subdomains
        has_spf_dkim=False,   # No email security
        domain_expiry_days=5, # Expiring soon
        privacy_enabled=False, # No privacy protection
        whois_email_exposed=True, # Email exposed
        
        # D2: Breach & Credential Exposure - Severe
        breach_instances=10,  # Multiple breaches
        password_exposed=True, # Passwords leaked
        credential_reuse=True, # Reused credentials
        leaked_in_code=True,  # Code leaks
        unique_emails_exposed=50, # Many emails exposed
        
        # D3: Infrastructure & Network - Vulnerable
        open_ports_count=10,  # Many open ports
        has_waf=False,        # No WAF
        infra_outdated=True,  # Outdated infrastructure
        vulnerable_services_count=5, # Vulnerable services
        cdn_bypass_detected=True, # CDN bypass possible
        
        # D4: Application/Website Risk - Outdated
        outdated_cms=True,    # Outdated CMS
        missing_security_headers=True, # Missing headers
        known_cve_count=10,   # Known vulnerabilities
        public_repo_leaks_count=5, # Code leaks
        exploit_tech_count=3, # Exploit techniques
        
        # D5: Social & OSINT Intelligence - Exposed
        employee_emails_exposed=True, # Employee emails public
        public_org_leaks_count=10, # Organization leaks
        used_in_phishing=True, # Used in phishing
        predictable_pattern=True, # Predictable patterns
        
        # D6: Threat Intelligence / Dark Web - Active
        seen_in_marketplaces=True, # Seen in marketplaces
        underground_mentions_count=10, # Underground mentions
        ioc_match_count=5, # IOC matches
    )
    
    result = calculate_oes(input_data)
    print(f"OES Score: {result.score}/100")
    print(f"Total Deductions: {result.total_deduction}")
    print("Category Breakdown:")
    for category, deduction in result.deductions.items():
        print(f"  {category}: {deduction}")
    print()

def demo_medium_risk_score():
    """Demonstrate a medium-risk scenario"""
    print("⚠️  MEDIUM RISK SCENARIO")
    print("=" * 50)
    
    input_data = ScoringInput(
        # D1: Domain Footprint - Some issues
        subdomain_count=25,
        has_spf_dkim=True,
        domain_expiry_days=60,
        privacy_enabled=True,
        whois_email_exposed=False,
        
        # D2: Breach & Credential Exposure - Some exposure
        breach_instances=2,
        password_exposed=False,
        credential_reuse=True,
        leaked_in_code=False,
        unique_emails_exposed=5,
        
        # D3: Infrastructure & Network - Some issues
        open_ports_count=2,
        has_waf=True,
        infra_outdated=False,
        vulnerable_services_count=1,
        cdn_bypass_detected=False,
        
        # D4: Application/Website Risk - Some vulnerabilities
        outdated_cms=False,
        missing_security_headers=True,
        known_cve_count=2,
        public_repo_leaks_count=1,
        exploit_tech_count=0,
        
        # D5: Social & OSINT Intelligence - Some exposure
        employee_emails_exposed=False,
        public_org_leaks_count=2,
        used_in_phishing=False,
        predictable_pattern=False,
        
        # D6: Threat Intelligence / Dark Web - Some activity
        seen_in_marketplaces=False,
        underground_mentions_count=1,
        ioc_match_count=1,
    )
    
    result = calculate_oes(input_data)
    print(f"OES Score: {result.score}/100")
    print(f"Total Deductions: {result.total_deduction}")
    print("Category Breakdown:")
    for category, deduction in result.deductions.items():
        print(f"  {category}: {deduction}")
    print()

def main():
    """Run all demo scenarios"""
    print("🎯 OVERALL EXPOSURE SCORE (OES) ENGINE DEMO")
    print("=" * 60)
    print()
    
    demo_perfect_score()
    demo_medium_risk_score()
    demo_high_risk_score()
    
    print("📊 SCORING CATEGORIES EXPLAINED:")
    print("=" * 40)
    print("D1: Domain Footprint (max 10 points)")
    print("  - Subdomain count, SPF/DKIM, domain expiry, privacy, WHOIS exposure")
    print()
    print("D2: Breach & Credential Exposure (max 25 points)")
    print("  - Breach instances, password exposure, credential reuse, code leaks")
    print()
    print("D3: Infrastructure & Network (max 20 points)")
    print("  - Open ports, WAF, outdated infrastructure, vulnerable services")
    print()
    print("D4: Application/Website Risk (max 20 points)")
    print("  - CMS updates, security headers, CVEs, repo leaks, exploit techniques")
    print()
    print("D5: Social & OSINT Intelligence (max 15 points)")
    print("  - Employee email exposure, org leaks, phishing usage, patterns")
    print()
    print("D6: Threat Intelligence / Dark Web (max 10 points)")
    print("  - Marketplace presence, underground mentions, IOC matches")
    print()

if __name__ == "__main__":
    main() 