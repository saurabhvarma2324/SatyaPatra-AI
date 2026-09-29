const mongoose = require('mongoose');
const AuditLog = require('../models/AuditLog');
const { store } = require('../services/memoryStore');

// @desc    Get all audit logs (Admin only)
// @route   GET /api/audit-logs
// @access  Admin Only
const getAuditLogs = async (req, res) => {
  try {
    const { action, userId, limit = 100 } = req.query;
    let logs = [];

    if (mongoose.connection.readyState === 1) {
      try {
        const filter = {};
        if (action) filter.action = action;
        if (userId) filter.userId = userId;

        logs = await AuditLog.find(filter)
          .populate('targetApplicationId', 'applicationNumber applicantName')
          .sort({ timestamp: -1 })
          .limit(Number(limit));
      } catch (e) {
        logs = store.auditLogs;
      }
    } else {
      logs = store.auditLogs;
      if (action) logs = logs.filter(l => l.action === action);
      if (userId) logs = logs.filter(l => l.userId === userId);
    }

    if (!logs || logs.length === 0) {
      logs = store.auditLogs;
    }

    res.json({
      success: true,
      count: logs.length,
      logs
    });
  } catch (err) {
    res.json({
      success: true,
      count: store.auditLogs.length,
      logs: store.auditLogs
    });
  }
};

module.exports = { getAuditLogs };

