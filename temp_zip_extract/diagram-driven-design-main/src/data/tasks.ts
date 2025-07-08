
export type OsintTask = {
  name: string;
  points: number;
};

export type OsintCategory = {
  category: string;
  tasks: OsintTask[];
};

export const osintTasks: OsintCategory[] = [
  {
    category: 'Domain Footprint Penalty (D1, max 10 points)',
    tasks: [
      { name: 'Too many subdomains exposed (>50)', points: -2 },
      { name: 'No DMARC/SPF/DKIM', points: -3 },
      { name: 'Expired or soon-to-expire domain (<30 days)', points: -2 },
      { name: 'Outdated WHOIS or privacy disabled', points: -2 },
      { name: 'WHOIS email exposed', points: -1 },
    ],
  },
  {
    category: 'Breach & Credential Exposure (D2, max 25 points)',
    tasks: [
      { name: 'Email in past breaches (per instance)', points: -2 },
      { name: 'Password exposed in plaintext', points: -5 },
      { name: 'Credential reuse across platforms', points: -3 },
      { name: 'Leaked credentials in code repositories', points: -5 },
      { name: 'Total exposed unique emails >10', points: -10 },
    ],
  },
  {
    category: 'Infrastructure & Network Risks (D3, max 20 points)',
    tasks: [
      { name: 'Open sensitive ports (e.g., RDP, SMB, SSH)', points: -5 },
      { name: 'No reverse proxy/WAF', points: -2 },
      { name: 'Outdated infrastructure (e.g., deprecated OS)', points: -3 },
      { name: 'Vulnerable services (CVE matched)', points: -5 },
      { name: 'CDN/WAF bypass detected', points: -5 },
    ],
  },
  {
    category: 'Application/Website Risks (D4, max 20 points)',
    tasks: [
      { name: 'Outdated CMS/plugins', points: -5 },
      { name: 'Missing HTTP security headers', points: -3 },
      { name: 'Known CVEs (via Wappalyzer)', points: -5 },
      { name: 'Public repository leaks (e.g., S3, Git)', points: -4 },
      { name: 'Technologies with known exploits', points: -3 },
    ],
  },
  {
    category: 'Social & OSINT Intelligence Exposure (D5, max 15 points)',
    tasks: [
      { name: 'Employee emails/roles discoverable', points: -5 },
      { name: 'Public GitHub/organizational leaks', points: -4 },
      { name: 'Domain/email used in phishing campaigns', points: -3 },
      { name: 'Predictable email patterns', points: -3 },
    ],
  },
  {
    category: 'Threat Intelligence/Dark Web Presence (D6, max 10 points)',
    tasks: [
      { name: 'Domain/email in dark web marketplaces', points: -5 },
      { name: 'Mentions in underground forums', points: -3 },
      { name: 'IOC match with malware/C2 infrastructure', points: -2 },
    ],
  },
];
