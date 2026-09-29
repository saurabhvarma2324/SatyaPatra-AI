const store = require('../services/store');
const intelligenceService = require('../services/intelligenceService');

const getIOCs = async (req, res) => {
  try {
    const { type, risk, search } = req.query;
    const iocs = store.getAllIOCs({ type, risk, search });
    return res.status(200).json({ success: true, count: iocs.length, data: iocs });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getIOCsByCaseId = async (req, res) => {
  try {
    const caseId = req.params.caseId;
    const iocs = store.getIOCsByCaseId(caseId);
    return res.status(200).json({ success: true, count: iocs.length, data: iocs });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getIOCEnrichment = async (req, res) => {
  try {
    const { type, value } = req.query;
    if (!type || !value) {
      return res.status(400).json({ success: false, message: 'Type and value are required for enrichment.' });
    }

    let intel;
    if (type === 'ip') {
      intel = await intelligenceService.getIPIntelligence(value);
    } else if (type === 'domain') {
      intel = await intelligenceService.getDomainIntelligence(value);
    } else if (type === 'url') {
      intel = await intelligenceService.getURLIntelligence(value);
    } else {
      intel = { value, type, status: 'Extracted Forensic Artifact', demo: true };
    }

    return res.status(200).json({ success: true, data: intel });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getIOCs, getIOCsByCaseId, getIOCEnrichment };
