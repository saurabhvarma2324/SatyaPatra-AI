const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  userName: {
    type: String,
    default: 'System / Guest'
  },
  role: {
    type: String,
    default: 'officer'
  },
  action: {
    type: String,
    required: true,
    enum: [
      'USER_LOGIN',
      'USER_SIGNUP',
      'APPLICATION_CREATED',
      'DOCUMENT_UPLOADED',
      'DOCUMENT_VIEWED',
      'VERIFICATION_TRIGGERED',
      'OFFICER_DECISION',
      'STATUS_CHANGED',
      'REPORT_EXPORTED_PDF',
      'SCHEME_CREATED',
      'SCHEME_UPDATED'
    ]
  },
  targetApplicationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Application'
  },
  details: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  ipAddress: {
    type: String,
    default: '127.0.0.1'
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  }
});

module.exports = mongoose.model('AuditLog', auditLogSchema);
