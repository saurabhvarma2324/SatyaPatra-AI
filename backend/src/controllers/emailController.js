const path = require('path');
const fs = require('fs');
const store = require('../services/store');
const { analyzeEmail } = require('../services/aiService');

const SAMPLE_EMAILS_DIR = path.join(__dirname, '../../uploads/sample-emails');

const uploadAndAnalyze = async (req, res) => {
  try {
    let caseId = req.body.caseId;
    const file = req.file;
    const emlContent = req.body.emlContent;

    if (!file && !emlContent) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a valid .eml file or provide raw email content.'
      });
    }

    // If no caseId provided, create one automatically
    let caseItem;
    if (!caseId || caseId === 'new') {
      caseItem = store.createCase({
        title: req.body.title || (file ? `Email Triage: ${file.originalname}` : 'Email Ingestion Analysis'),
        priority: 'HIGH',
        investigatorName: req.user ? req.user.name : 'Dr. Alok Verma'
      });
      caseId = caseItem.caseId;
    } else {
      caseItem = store.getCaseById(caseId);
    }

    const filePath = file ? file.path : null;

    // Run AI Engine Analysis
    const analysis = await analyzeEmail({ emlContent, filePath, caseId });

    // Save Email data
    const emailRecord = store.saveEmail({
      caseId,
      filename: file ? file.originalname : 'raw_email.eml',
      subject: analysis.headers.subject,
      sender: analysis.headers.sender,
      recipient: analysis.headers.recipient,
      cc: analysis.headers.cc,
      replyTo: analysis.headers.reply_to,
      date: analysis.headers.date,
      messageId: analysis.headers.message_id,
      headers: analysis.headers,
      bodyText: analysis.body_text,
      bodyHtml: analysis.body_html,
      attachments: analysis.attachments || [],
      urls: analysis.iocs.filter(i => i.type === 'url').map(i => i.value),
      ips: analysis.iocs.filter(i => i.type === 'ip').map(i => i.value),
      domains: analysis.iocs.filter(i => i.type === 'domain').map(i => i.value)
    });

    // Save Threat Result
    const threatRecord = store.saveThreatResult({
      caseId,
      emailId: emailRecord.id,
      threatType: analysis.threat_type,
      riskScore: analysis.risk_score,
      riskLevel: analysis.risk_level,
      confidence: analysis.confidence,
      reasons: analysis.reasons,
      anomalyScore: analysis.anomaly_score,
      anomalyStatus: analysis.anomaly_status,
      heuristicFlags: analysis.heuristic_flags,
      modelVersion: analysis.model_version
    });

    // Save IOCs
    const iocsRecord = store.saveIOCs(caseId, analysis.iocs);

    // Save Timeline Events
    if (analysis.timeline_events && analysis.timeline_events.length > 0) {
      store.saveTimelineEvents(caseId, analysis.timeline_events);
    }

    // Update Case attributes
    store.updateCase(caseId, {
      threatType: analysis.threat_type,
      threatLevel: analysis.risk_level,
      riskScore: analysis.risk_score,
      confidence: analysis.confidence,
      title: caseItem.title.startsWith('Email Triage') && analysis.headers.subject ? analysis.headers.subject : caseItem.title,
      emailId: emailRecord.id
    });

    // Send high-risk notification if risk is high
    if (analysis.risk_score >= 70) {
      store.addNotification({
        title: `High Threat Detected: ${analysis.threat_type}`,
        message: `Case ${caseId} scored ${analysis.risk_score}/100. ${analysis.reasons[0] || ''}`,
        type: 'THREAT_ALERT',
        caseId
      });
    }

    return res.status(200).json({
      success: true,
      caseId,
      data: {
        case: store.getCaseById(caseId),
        analysis,
        email: emailRecord,
        threat: threatRecord,
        iocs: iocsRecord
      }
    });
  } catch (error) {
    console.error('[EmailController Error]', error);
    return res.status(500).json({
      success: false,
      message: 'Unable to analyze this email. Please verify that the uploaded file is a valid .eml file.'
    });
  }
};

const getSampleEmails = async (req, res) => {
  try {
    const samples = [
      {
        id: 'sample-phish',
        filename: 'urgent_account_verification.eml',
        title: 'Urgent Account Verification (Phishing)',
        threatType: 'Phishing',
        description: 'Executive phishing lure targeting Microsoft SSO credentials with typosquatted link.',
        expectedRisk: 'CRITICAL (99/100)'
      },
      {
        id: 'sample-malware',
        filename: 'invoice_malware_executable.eml',
        title: 'Commercial Overdue Invoice (Malware Lure)',
        threatType: 'Malware',
        description: 'Fraudulent accounting bill with disguised screensaver executable attachment.',
        expectedRisk: 'HIGH (89/100)'
      },
      {
        id: 'sample-safe',
        filename: 'legitimate_org_meeting.eml',
        title: 'Team Strategy Sync (Legitimate Org)',
        threatType: 'Safe',
        description: 'Standard internal engineering sync with valid DKIM and SPF cryptographic signatures.',
        expectedRisk: 'SAFE (12/100)'
      },
      {
        id: 'sample-spam',
        filename: 'crypto_lottery_scam.eml',
        title: '50,000 USDT Token Airdrop (Crypto Spam)',
        threatType: 'Spam',
        description: 'Unsolicited bulk marketing email advertising fraudulent Web3 lottery claim.',
        expectedRisk: 'MEDIUM (68/100)'
      },
      {
        id: 'sample-bec',
        filename: 'ceo_wire_transfer_spoof.eml',
        title: 'CEO Confidential Wire Request (BEC)',
        threatType: 'Suspicious',
        description: 'Executive impersonation demanding urgent offshore wire transfer.',
        expectedRisk: 'CRITICAL (92/100)'
      }
    ];

    return res.status(200).json({ success: true, samples });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const loadSample = async (req, res) => {
  try {
    const { filename, title } = req.body;
    if (!filename) {
      return res.status(400).json({ success: false, message: 'Sample filename is required.' });
    }

    const samplePath = path.join(SAMPLE_EMAILS_DIR, filename);
    if (!fs.existsSync(samplePath)) {
      return res.status(404).json({ success: false, message: `Sample file '${filename}' not found on server.` });
    }

    const content = fs.readFileSync(samplePath, 'utf8');

    // Create a new case
    const newCase = store.createCase({
      title: title || `Demo Investigation: ${filename}`,
      priority: 'HIGH',
      investigatorName: req.user ? req.user.name : 'Dr. Alok Verma'
    });

    // Run AI Engine Analysis
    const analysis = await analyzeEmail({ emlContent: content, filePath: samplePath, caseId: newCase.caseId });

    // Save Email data
    const emailRecord = store.saveEmail({
      caseId: newCase.caseId,
      filename,
      subject: analysis.headers.subject,
      sender: analysis.headers.sender,
      recipient: analysis.headers.recipient,
      cc: analysis.headers.cc,
      replyTo: analysis.headers.reply_to,
      date: analysis.headers.date,
      messageId: analysis.headers.message_id,
      headers: analysis.headers,
      bodyText: analysis.body_text,
      bodyHtml: analysis.body_html,
      attachments: analysis.attachments || [],
      urls: analysis.iocs.filter(i => i.type === 'url').map(i => i.value),
      ips: analysis.iocs.filter(i => i.type === 'ip').map(i => i.value),
      domains: analysis.iocs.filter(i => i.type === 'domain').map(i => i.value)
    });

    // Save Threat Result
    const threatRecord = store.saveThreatResult({
      caseId: newCase.caseId,
      emailId: emailRecord.id,
      threatType: analysis.threat_type,
      riskScore: analysis.risk_score,
      riskLevel: analysis.risk_level,
      confidence: analysis.confidence,
      reasons: analysis.reasons,
      anomalyScore: analysis.anomaly_score,
      anomalyStatus: analysis.anomaly_status,
      heuristicFlags: analysis.heuristic_flags,
      modelVersion: analysis.model_version
    });

    // Save IOCs
    const iocsRecord = store.saveIOCs(newCase.caseId, analysis.iocs);

    // Save Timeline Events
    if (analysis.timeline_events && analysis.timeline_events.length > 0) {
      store.saveTimelineEvents(newCase.caseId, analysis.timeline_events);
    }

    // Update Case
    store.updateCase(newCase.caseId, {
      threatType: analysis.threat_type,
      threatLevel: analysis.risk_level,
      riskScore: analysis.risk_score,
      confidence: analysis.confidence,
      title: analysis.headers.subject || newCase.title,
      emailId: emailRecord.id
    });

    return res.status(201).json({
      success: true,
      caseId: newCase.caseId,
      data: {
        case: store.getCaseById(newCase.caseId),
        analysis,
        email: emailRecord,
        threat: threatRecord,
        iocs: iocsRecord
      }
    });
  } catch (error) {
    console.error('[EmailController loadSample Error]', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { uploadAndAnalyze, getSampleEmails, loadSample };
