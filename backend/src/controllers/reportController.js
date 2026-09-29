const store = require('../services/store');

const getReportByCaseId = async (req, res) => {
  try {
    const caseId = req.params.caseId;
    const caseItem = store.getCaseById(caseId);
    if (!caseItem) {
      return res.status(404).json({ success: false, message: 'Case not found.' });
    }

    let report = store.getReportByCaseId(caseId);
    if (!report) {
      // Auto-generate report from case telemetry
      const email = store.getEmailByCaseId(caseId);
      const threat = store.getThreatResultByCaseId(caseId);
      const iocs = store.getIOCsByCaseId(caseId);
      const timeline = store.getTimelineEventsByCaseId(caseId);

      report = store.saveReport({
        caseId,
        title: `Official Forensic Investigation Report — ${caseId}`,
        generatedBy: req.user ? req.user.name : 'Dr. Alok Verma',
        investigatorBadge: req.user ? req.user.badge : 'Senior Forensic Investigator',
        status: caseItem.status,
        summary: `MailDrishti AI automated forensic analysis completed for case ${caseId}. The evaluated email artifact was determined to exhibit ${caseItem.threatLevel} risk characteristics classified as ${caseItem.threatType}.`,
        findings: {
          case: caseItem,
          email,
          threat,
          iocs,
          timeline,
          notes: caseItem.notes || []
        },
        disclaimer: 'AI-assisted forensic assessment. Final verification and evidentiary sign-off completed by authorized cybersecurity investigator.'
      });
    }

    return res.status(200).json({ success: true, data: report });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const generateReport = async (req, res) => {
  try {
    const caseId = req.params.caseId;
    const caseItem = store.getCaseById(caseId);
    if (!caseItem) {
      return res.status(404).json({ success: false, message: 'Case not found.' });
    }

    const email = store.getEmailByCaseId(caseId);
    const threat = store.getThreatResultByCaseId(caseId);
    const iocs = store.getIOCsByCaseId(caseId);
    const timeline = store.getTimelineEventsByCaseId(caseId);

    const report = store.saveReport({
      caseId,
      title: `Official Forensic Investigation Report — ${caseId}`,
      generatedBy: req.user ? req.user.name : 'Dr. Alok Verma',
      investigatorBadge: req.user ? req.user.badge : 'Senior Forensic Investigator',
      status: caseItem.status,
      summary: req.body.summary || `Forensic examination of inbound email artifact completed. The subject '${email ? email.subject : caseItem.title}' has been assessed with risk score ${caseItem.riskScore}/100.`,
      findings: {
        case: caseItem,
        email,
        threat,
        iocs,
        timeline,
        notes: caseItem.notes || []
      },
      disclaimer: 'AI-assisted forensic assessment. Final verification and evidentiary sign-off completed by authorized cybersecurity investigator.'
    });

    // Notify
    store.addNotification({
      title: 'Investigation Report Finalized',
      message: `Forensic report generated for ${caseId}.`,
      type: 'REPORT_READY',
      caseId
    });

    return res.status(200).json({ success: true, data: report });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getAllReports = async (req, res) => {
  try {
    const cases = store.getAllCases();
    const reports = cases.map(c => {
      const rep = store.getReportByCaseId(c.caseId);
      return rep || {
        caseId: c.caseId,
        title: `Forensic Dossier — ${c.caseId}`,
        generatedBy: c.investigatorName,
        status: c.status,
        threatLevel: c.threatLevel,
        threatType: c.threatType,
        riskScore: c.riskScore,
        createdAt: c.createdAt
      };
    });
    return res.status(200).json({ success: true, count: reports.length, data: reports });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getReportByCaseId, generateReport, getAllReports };
