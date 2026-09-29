const store = require('../services/store');

const getTimelineByCaseId = async (req, res) => {
  try {
    const caseId = req.params.caseId;
    const events = store.getTimelineEventsByCaseId(caseId);
    return res.status(200).json({ success: true, caseId, count: events.length, data: events });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getAllTimeline = async (req, res) => {
  try {
    const events = store.getAllTimelineEvents();
    return res.status(200).json({ success: true, count: events.length, data: events });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getTimelineByCaseId, getAllTimeline };
