const mongoose = require('mongoose');

const verificationReportSchema = new mongoose.Schema({
  applicationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Application',
    required: true,
    index: true
  },
  riskScore: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
    default: 0
  },
  riskLevel: {
    type: String,
    enum: ['LOW', 'MEDIUM', 'HIGH'],
    default: 'LOW'
  },
  fieldChecks: [mongoose.Schema.Types.Mixed],
  crossDocumentChecks: {
    consistencyScore: { type: Number, default: 100 },
    nameComparisons: [mongoose.Schema.Types.Mixed],
    dobComparisons: [mongoose.Schema.Types.Mixed],
    categoryComparisons: [mongoose.Schema.Types.Mixed],
    bankComparisons: [mongoose.Schema.Types.Mixed],
    crossCheckFlags: [mongoose.Schema.Types.Mixed]
  },
  duplicateFlags: [mongoose.Schema.Types.Mixed],
  eligibilityResults: {
    isEligible: { type: Boolean, default: true },
    overallStatus: { type: String, default: 'ELIGIBLE' },
    rulesEvaluated: [mongoose.Schema.Types.Mixed]
  },
  summaryReasons: [{
    type: String
  }],
  generatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('VerificationReport', verificationReportSchema);
