const bcrypt = require('bcryptjs');

const getSeedData = () => {
  const passwordHash = bcrypt.hashSync('Demo@123', 10);
  const adminPasswordHash = bcrypt.hashSync('Admin@123', 10);

  const users = [
    {
      id: 'usr-1',
      name: 'Dr. Alok Verma',
      email: 'investigator@maildrishti.ai',
      passwordHash: passwordHash,
      role: 'INVESTIGATOR',
      status: 'ACTIVE',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      badge: 'Senior Forensic Investigator',
      createdAt: new Date('2026-09-01T08:00:00Z')
    },
    {
      id: 'usr-2',
      name: 'System Security Admin',
      email: 'admin@maildrishti.ai',
      passwordHash: adminPasswordHash,
      role: 'ADMIN',
      status: 'ACTIVE',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      badge: 'SOC Global Administrator',
      createdAt: new Date('2026-09-01T08:00:00Z')
    }
  ];

  const cases = [
    {
      id: 'case-001',
      caseId: 'CASE-2026-001',
      title: 'Suspicious Account Verification Email (Executive Phishing)',
      description: 'Inbound high-priority security alert attempting to harvest corporate SSO credentials via spoofed domain sample-login.test.',
      priority: 'CRITICAL',
      status: 'UNDER_INVESTIGATION',
      threatLevel: 'CRITICAL',
      threatType: 'Phishing',
      riskScore: 99,
      confidence: 0.96,
      investigatorId: 'investigator@maildrishti.ai',
      investigatorName: 'Dr. Alok Verma',
      notes: [
        {
          id: 'note-1',
          author: 'Dr. Alok Verma',
          text: 'Initial triage completed. Phishing domain sample-login.test resolves to bulletproof hosting in Amsterdam (AS49544). Originating hop traces to Frankfurt Tor exit node. Domain registered 48 hours ago.',
          timestamp: new Date('2026-09-14T10:45:00Z')
        }
      ],
      createdAt: new Date('2026-09-14T10:42:00Z'),
      updatedAt: new Date('2026-09-14T10:45:00Z')
    },
    {
      id: 'case-002',
      caseId: 'CASE-2026-002',
      title: 'Overdue Commercial Invoice #INV-88392 (Malware Delivery)',
      description: 'Lure email targeting accounts payable with an executable screensaver script disguised in a ZIP archive.',
      priority: 'HIGH',
      status: 'CONFIRMED_THREAT',
      threatLevel: 'HIGH',
      threatType: 'Malware',
      riskScore: 89,
      confidence: 0.94,
      investigatorId: 'investigator@maildrishti.ai',
      investigatorName: 'Dr. Alok Verma',
      notes: [
        {
          id: 'note-2',
          author: 'Dr. Alok Verma',
          text: 'Confirmed malware drop. Attachment Invoice_INV88392_Remittance_Slip.scr.zip contains double-extension payload. Blocked at enterprise boundary.',
          timestamp: new Date('2026-09-14T08:30:00Z')
        }
      ],
      createdAt: new Date('2026-09-14T08:15:00Z'),
      updatedAt: new Date('2026-09-14T08:30:00Z')
    },
    {
      id: 'case-003',
      caseId: 'CASE-2026-003',
      title: 'Q3 Cybersecurity Strategy & Platform Roadmap Review',
      description: 'Routine internal organizational meeting invite sent from authorized domain with verified SPF and DKIM signatures.',
      priority: 'LOW',
      status: 'RESOLVED',
      threatLevel: 'SAFE',
      threatType: 'Safe',
      riskScore: 12,
      confidence: 0.95,
      investigatorId: 'investigator@maildrishti.ai',
      investigatorName: 'Dr. Alok Verma',
      notes: [
        {
          id: 'note-3',
          author: 'Dr. Alok Verma',
          text: 'Verified benign internal communication. Closed as false alarm triage.',
          timestamp: new Date('2026-09-14T09:15:00Z')
        }
      ],
      createdAt: new Date('2026-09-14T09:00:00Z'),
      updatedAt: new Date('2026-09-14T09:15:00Z')
    },
    {
      id: 'case-004',
      caseId: 'CASE-2026-004',
      title: '50,000 USDT Decentralized Crypto Airdrop Giveaway',
      description: 'Bulk unsolicited promotional email redirecting to an unauthorized Web3 token claim portal.',
      priority: 'MEDIUM',
      status: 'RESOLVED',
      threatLevel: 'SUSPICIOUS',
      threatType: 'Spam',
      riskScore: 68,
      confidence: 0.91,
      investigatorId: 'investigator@maildrishti.ai',
      investigatorName: 'Dr. Alok Verma',
      notes: [
        {
          id: 'note-4',
          author: 'Dr. Alok Verma',
          text: 'Added domain claim-crypto-airdrop.icu to perimeter firewall blackhole.',
          timestamp: new Date('2026-09-14T06:40:00Z')
        }
      ],
      createdAt: new Date('2026-09-14T06:20:00Z'),
      updatedAt: new Date('2026-09-14T06:40:00Z')
    },
    {
      id: 'case-005',
      caseId: 'CASE-2026-005',
      title: 'Confidential Strategic Acquisition Wire Authorization ($175,000)',
      description: 'Business Email Compromise (BEC) attempt impersonating CEO Rajesh Sharma instructing urgent wire to offshore Seychelles account.',
      priority: 'CRITICAL',
      status: 'UNDER_INVESTIGATION',
      threatLevel: 'CRITICAL',
      threatType: 'Suspicious',
      riskScore: 92,
      confidence: 0.93,
      investigatorId: 'investigator@maildrishti.ai',
      investigatorName: 'Dr. Alok Verma',
      notes: [
        {
          id: 'note-5',
          author: 'Dr. Alok Verma',
          text: 'CFO flagged message. Sender domain differs from official corporate email; Reply-To routes to temporary offshore inbox. Notified executive security team.',
          timestamp: new Date('2026-09-14T11:20:00Z')
        }
      ],
      createdAt: new Date('2026-09-14T11:05:00Z'),
      updatedAt: new Date('2026-09-14T11:20:00Z')
    }
  ];

  const emails = [
    {
      id: 'eml-001',
      caseId: 'CASE-2026-001',
      filename: 'urgent_account_verification.eml',
      subject: 'Urgent Account Verification Required - Security Incident ID #99281',
      sender: 'Global Security Desk <security-alert@sample-domain.test>',
      recipient: 'Alex Mercer <alex.mercer@victim-enterprise.com>',
      cc: '',
      replyTo: 'security-verify@suspicious-auth-portal.test',
      date: 'Mon, 14 Sep 2026 10:42:00 +0000',
      messageId: '<20260914104200.99281.sec@sample-domain.test>',
      headers: {
        subject: 'Urgent Account Verification Required - Security Incident ID #99281',
        sender: 'Global Security Desk <security-alert@sample-domain.test>',
        recipient: 'Alex Mercer <alex.mercer@victim-enterprise.com>',
        reply_to: 'security-verify@suspicious-auth-portal.test',
        date: 'Mon, 14 Sep 2026 10:42:00 +0000',
        message_id: '<20260914104200.99281.sec@sample-domain.test>',
        spf: 'FAIL',
        dkim: 'FAIL',
        dmarc: 'FAIL',
        sender_domain: 'sample-domain.test',
        reply_to_domain: 'suspicious-auth-portal.test',
        received_chain: [
          'from mail-relay-02.sample-domain.test (203.0.113.10) by mx.victim-enterprise.com with ESMTPS',
          'from 185.220.101.5 (attacker-node-x.net) by mail-relay-02.sample-domain.test'
        ]
      },
      bodyText: 'Dear Alex Mercer,\n\nOur automated security monitoring system detected an unauthorized login attempt on your corporate account from an unrecognized IP address (198.51.100.45) in Amsterdam, Netherlands.\n\nTo prevent permanent account suspension and protect enterprise data, you must re-verify your identity within 24 hours via: https://sample-login.test/verify-auth?id=99281&user=alex.mercer\n\nFailure to complete verification will result in immediate termination of corporate single sign-on access.',
      bodyHtml: '<div style="font-family: Arial, sans-serif;"><h2 style="color: #d9534f;">⚠️ Immediate Security Action Required</h2><p>Our automated security monitoring system detected an unauthorized login attempt...</p><a href="https://sample-login.test/verify-auth?id=99281&user=alex.mercer">Verify Account Identity Now</a></div>',
      attachments: [],
      urls: ['https://sample-login.test/verify-auth?id=99281&user=alex.mercer'],
      ips: ['203.0.113.10', '185.220.101.5', '198.51.100.45'],
      domains: ['sample-login.test', 'sample-domain.test', 'suspicious-auth-portal.test'],
      uploadedAt: new Date('2026-09-14T10:42:00Z')
    }
  ];

  const threats = [
    {
      id: 'thr-001',
      caseId: 'CASE-2026-001',
      emailId: 'eml-001',
      threatType: 'Phishing',
      riskScore: 99,
      riskLevel: 'CRITICAL',
      confidence: 0.96,
      reasons: [
        'AI NLP Classifier detected credential-harvesting/phishing patterns with 96% confidence.',
        'Isolation Forest detected elevated structural deviations (anomaly score 0.56).',
        '[!] Sender domain (sample-domain.test) differs from Reply-To domain (suspicious-auth-portal.test).',
        '[!] Multiple psychological urgency cues (4 detected: urgent, suspended, 24 hours, unauthorized).',
        '[!] Email authentication failed: SPF=FAIL, DKIM=FAIL, DMARC=FAIL.',
        '[!] 1 suspicious or potentially spoofed URL detected in email body.',
        '[!] Originating relay IP 203.0.113.10 maps to bulletproof hosting infrastructure (AS49544).'
      ],
      anomalyScore: 0.56,
      anomalyStatus: 'ELEVATED',
      heuristicFlags: {
        has_suspicious_url: true,
        domain_mismatch: true,
        auth_failure: true,
        dangerous_attachment: false,
        high_anomaly: true,
        urgency_cues: true,
        bulletproof_asn: true
      },
      modelVersion: 'MailDrishti-NLP-v1.2',
      createdAt: new Date('2026-09-14T10:44:00Z')
    }
  ];

  const iocs = [
    {
      id: 'ioc-1',
      caseId: 'CASE-2026-001',
      type: 'ip',
      value: '203.0.113.10',
      source: 'Received Header',
      risk: 'HIGH',
      status: 'Suspicious Bulletproof Relay',
      metadata: { country: 'Netherlands', city: 'Amsterdam', asn: 'AS49544' },
      createdAt: new Date('2026-09-14T10:43:00Z')
    },
    {
      id: 'ioc-2',
      caseId: 'CASE-2026-001',
      type: 'ip',
      value: '185.220.101.5',
      source: 'Received Origin Hop',
      risk: 'CRITICAL',
      status: 'Tor Exit Node Relay',
      metadata: { country: 'Germany', city: 'Frankfurt am Main', asn: 'AS200651' },
      createdAt: new Date('2026-09-14T10:43:00Z')
    },
    {
      id: 'ioc-3',
      caseId: 'CASE-2026-001',
      type: 'ip',
      value: '198.51.100.45',
      source: 'Email Body Text',
      risk: 'HIGH',
      status: 'Lure IP Address',
      metadata: { country: 'Russia', city: 'Moscow', asn: 'AS58224' },
      createdAt: new Date('2026-09-14T10:43:00Z')
    },
    {
      id: 'ioc-4',
      caseId: 'CASE-2026-001',
      type: 'url',
      value: 'https://sample-login.test/verify-auth?id=99281&user=alex.mercer',
      source: 'Email Body Link',
      risk: 'CRITICAL',
      status: 'Credential Harvesting Target',
      metadata: { domain: 'sample-login.test', protocol: 'https' },
      createdAt: new Date('2026-09-14T10:43:00Z')
    },
    {
      id: 'ioc-5',
      caseId: 'CASE-2026-001',
      type: 'domain',
      value: 'sample-login.test',
      source: 'Email URL',
      risk: 'CRITICAL',
      status: 'Spoofed Phishing Domain',
      metadata: { tld: 'test', age_days: 2 },
      createdAt: new Date('2026-09-14T10:43:00Z')
    },
    {
      id: 'ioc-6',
      caseId: 'CASE-2026-001',
      type: 'domain',
      value: 'suspicious-auth-portal.test',
      source: 'Reply-To Header',
      risk: 'HIGH',
      status: 'Mismatched Reply Domain',
      metadata: { tld: 'test' },
      createdAt: new Date('2026-09-14T10:43:00Z')
    },
    {
      id: 'ioc-7',
      caseId: 'CASE-2026-001',
      type: 'email',
      value: 'security-alert@sample-domain.test',
      source: 'From Header',
      risk: 'HIGH',
      status: 'Spoofed Sender Identity',
      metadata: { auth_spf: 'FAIL' },
      createdAt: new Date('2026-09-14T10:43:00Z')
    },
    {
      id: 'ioc-8',
      caseId: 'CASE-2026-002',
      type: 'attachment',
      value: 'Invoice_INV88392_Remittance_Slip.scr.zip',
      source: 'MIME Attachment',
      risk: 'CRITICAL',
      status: 'Malicious Executable Payload',
      metadata: { size: 34812, sha256: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08' },
      createdAt: new Date('2026-09-14T08:16:00Z')
    },
    {
      id: 'ioc-9',
      caseId: 'CASE-2026-005',
      type: 'ip',
      value: '45.142.214.12',
      source: 'Received Header',
      risk: 'CRITICAL',
      status: 'Offshore Hosting IP',
      metadata: { country: 'Seychelles', city: 'Victoria', asn: 'AS60117' },
      createdAt: new Date('2026-09-14T11:06:00Z')
    }
  ];

  const timelineEvents = [
    {
      id: 'evt-1',
      caseId: 'CASE-2026-001',
      timestamp: '2026-09-14 10:42:00 UTC',
      eventType: 'EMAIL_RECEIVED',
      title: 'Email Received by Enterprise Gateway',
      description: 'Inbound message from security-alert@sample-domain.test accepted by postfix MTA.',
      source: 'Mail Transfer Agent (MTA)'
    },
    {
      id: 'evt-2',
      caseId: 'CASE-2026-001',
      timestamp: '2026-09-14 10:43:12 UTC',
      eventType: 'EMAIL_PARSED',
      title: 'Forensic Ingestion & Parsing',
      description: 'MIME structure parsed; sender, recipient, 2 relay hops, and body extracted safely without execution.',
      source: 'MailDrishti Forensic Parser'
    },
    {
      id: 'evt-3',
      caseId: 'CASE-2026-001',
      timestamp: '2026-09-14 10:43:30 UTC',
      eventType: 'IOC_EXTRACTED',
      title: 'IOC Extraction (7 artifacts)',
      description: 'Extracted 3 IP addresses, 1 credential URL, 2 domains, and 1 sender identity.',
      source: 'IOC Extraction Engine'
    },
    {
      id: 'evt-4',
      caseId: 'CASE-2026-001',
      timestamp: '2026-09-14 10:44:05 UTC',
      eventType: 'INTEL_ENRICHED',
      title: 'Network & Geo Intelligence Enriched',
      description: 'Resolved relay IP 203.0.113.10 to Amsterdam (AS49544) and origin hop 185.220.101.5 to Frankfurt Tor Node.',
      source: 'Geo & Threat Intel Services'
    },
    {
      id: 'evt-5',
      caseId: 'CASE-2026-001',
      timestamp: '2026-09-14 10:44:45 UTC',
      eventType: 'THREAT_SCORED',
      title: 'AI Threat Score Computed: 99/100 (CRITICAL Phishing)',
      description: 'TF-IDF model and Isolation Forest combined to generate risk score of 99 with 96% confidence.',
      source: 'MailDrishti AI Threat Engine'
    },
    {
      id: 'evt-6',
      caseId: 'CASE-2026-001',
      timestamp: '2026-09-14 10:45:00 UTC',
      eventType: 'INVESTIGATOR_REVIEW',
      title: 'Investigator Triage & Note Added',
      description: 'Dr. Alok Verma reviewed findings and initiated perimeter blocking for domain sample-login.test.',
      source: 'Investigator Portal'
    }
  ];

  const notifications = [
    {
      id: 'notif-1',
      title: 'Critical Phishing Incident',
      message: 'Case CASE-2026-001 flagged with Risk Score 99/100 targeting corporate credentials.',
      type: 'THREAT_ALERT',
      caseId: 'CASE-2026-001',
      read: false,
      createdAt: new Date('2026-09-14T10:45:00Z')
    },
    {
      id: 'notif-2',
      title: 'Malware Payload Quarantined',
      message: 'Executable script attachment blocked in Case CASE-2026-002.',
      type: 'IOC_EXTRACTED',
      caseId: 'CASE-2026-002',
      read: true,
      createdAt: new Date('2026-09-14T08:30:00Z')
    },
    {
      id: 'notif-3',
      title: 'Executive BEC Spoof Detected',
      message: 'Urgent wire transfer solicitation flagged in Case CASE-2026-005 (Score: 92/100).',
      type: 'THREAT_ALERT',
      caseId: 'CASE-2026-005',
      read: false,
      createdAt: new Date('2026-09-14T11:20:00Z')
    }
  ];

  return { users, cases, emails, threats, iocs, timelineEvents, notifications };
};

module.exports = { getSeedData };
