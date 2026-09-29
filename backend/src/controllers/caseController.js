const store = require('../services/store');

const getCases = async (req, res) => {
  try {
    const { search, risk, status, priority } = req.query;
    const cases = store.getAllCases({ search, risk, status, priority });
    return res.status(200).json({ success: true, count: cases.length, data: cases });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getCaseById = async (req, res) => {
  try {
    const caseId = req.params.id;
    const caseItem = store.getCaseById(caseId);
    if (!caseItem) {
      return res.status(404).json({ success: false, message: `Case '${caseId}' not found.` });
    }

    const email = store.getEmailByCaseId(caseItem.caseId);
    const threat = store.getThreatResultByCaseId(caseItem.caseId);
    const iocs = store.getIOCsByCaseId(caseItem.caseId);
    const timeline = store.getTimelineEventsByCaseId(caseItem.caseId);
    const report = store.getReportByCaseId(caseItem.caseId);

    return res.status(200).json({
      success: true,
      data: {
        ...caseItem,
        email,
        threat,
        iocs,
        timeline,
        report
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const createCase = async (req, res) => {
  try {
    const { title, description, priority, investigatorName } = req.body;
    if (!title) {
      return res.status(400).json({ success: false, message: 'Case title is required.' });
    }

    const newCase = store.createCase({
      title,
      description,
      priority: priority || 'HIGH',
      investigatorId: req.user ? req.user.email : 'investigator@maildrishti.ai',
      investigatorName: investigatorName || (req.user ? req.user.name : 'Dr. Alok Verma')
    });

    return res.status(201).json({ success: true, data: newCase });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const updateCase = async (req, res) => {
  try {
    const caseId = req.params.id;
    const { status, priority, title, description } = req.body;

    const updated = store.updateCase(caseId, {
      ...(status && { status }),
      ...(priority && { priority }),
      ...(title && { title }),
      ...(description && { description })
    });

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Case not found.' });
    }

    // Add status update to timeline if changed
    if (status) {
      store.addTimelineEvent({
        caseId: updated.caseId,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
        eventType: 'STATUS_CHANGE',
        title: `Case Status Changed to ${status.replace('_', ' ')}`,
        description: `Status updated by ${req.user ? req.user.name : 'Investigator'}.`,
        source: 'Investigator Action'
      });
    }

    return res.status(200).json({ success: true, data: updated });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const addNote = async (req, res) => {
  try {
    const caseId = req.params.id;
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ success: false, message: 'Note text is required.' });
    }

    const author = req.user ? req.user.name : 'Dr. Alok Verma';
    const note = store.addCaseNote(caseId, text, author);
    if (!note) {
      return res.status(404).json({ success: false, message: 'Case not found.' });
    }

    return res.status(201).json({ success: true, data: note });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getCases, getCaseById, createCase, updateCase, addNote };
