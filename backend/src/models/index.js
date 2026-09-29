const mongoose = require('mongoose');

// 1. User Schema
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['INVESTIGATOR', 'ADMIN'], default: 'INVESTIGATOR' },
  status: { type: String, enum: ['ACTIVE', 'INACTIVE'], default: 'ACTIVE' },
  avatar: { type: String, default: '' },
  badge: { type: String, default: 'SOC Analyst L2' },
  createdAt: { type: Date, default: Date.now }
});

// 2. Case Schema
const CaseSchema = new mongoose.Schema({
  caseId: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  priority: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'], default: 'HIGH' },
  status: { type: String, enum: ['UNDER_INVESTIGATION', 'CONFIRMED_THREAT', 'FALSE_POSITIVE', 'RESOLVED'], default: 'UNDER_INVESTIGATION' },
  threatLevel: { type: String, enum: ['SAFE', 'SUSPICIOUS', 'HIGH', 'CRITICAL'], default: 'HIGH' },
  threatType: { type: String, default: 'Phishing' },
  riskScore: { type: Number, default: 0 },
  investigatorId: { type: String, default: 'investigator@maildrishti.ai' },
  investigatorName: { type: String, default: 'Senior Cyber Investigator' },
  notes: [{
    id: String,
    author: String,
    text: String,
    timestamp: { type: Date, default: Date.now }
  }],
  emailId: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// 3. Email Schema
const EmailSchema = new mongoose.Schema({
  caseId: { type: String, required: true },
  filename: { type: String, default: '' },
  subject: { type: String, default: '' },
  sender: { type: String, default: '' },
  recipient: { type: String, default: '' },
  cc: { type: String, default: '' },
  replyTo: { type: String, default: '' },
  date: { type: String, default: '' },
  messageId: { type: String, default: '' },
  headers: { type: Object, default: {} },
  bodyText: { type: String, default: '' },
  bodyHtml: { type: String, default: '' },
  attachments: { type: Array, default: [] },
  urls: { type: Array, default: [] },
  ips: { type: Array, default: [] },
  domains: { type: Array, default: [] },
  uploadedAt: { type: Date, default: Date.now }
});

// 4. ThreatResult Schema
const ThreatResultSchema = new mongoose.Schema({
  caseId: { type: String, required: true },
  emailId: { type: String },
  threatType: { type: String, required: true },
  riskScore: { type: Number, required: true },
  riskLevel: { type: String, required: true },
  confidence: { type: Number, required: true },
  reasons: { type: [String], default: [] },
  anomalyScore: { type: Number, default: 0 },
  anomalyStatus: { type: String, default: 'NORMAL' },
  heuristicFlags: { type: Object, default: {} },
  modelVersion: { type: String, default: 'MailDrishti-NLP-v1.2' },
  createdAt: { type: Date, default: Date.now }
});

// 5. IOC Schema
const IOCSchema = new mongoose.Schema({
  caseId: { type: String, required: true },
  type: { type: String, enum: ['ip', 'domain', 'url', 'hash', 'email', 'attachment'], required: true },
  value: { type: String, required: true },
  source: { type: String, default: 'Email Body' },
  risk: { type: String, enum: ['SAFE', 'LOW', 'SUSPICIOUS', 'HIGH', 'CRITICAL'], default: 'SUSPICIOUS' },
  status: { type: String, default: 'Active' },
  metadata: { type: Object, default: {} },
  createdAt: { type: Date, default: Date.now }
});

// 6. TimelineEvent Schema
const TimelineEventSchema = new mongoose.Schema({
  caseId: { type: String, required: true },
  timestamp: { type: String, required: true },
  eventType: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  source: { type: String, default: 'System' },
  createdAt: { type: Date, default: Date.now }
});

// 7. Report Schema
const ReportSchema = new mongoose.Schema({
  caseId: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  generatedBy: { type: String, required: true },
  summary: { type: String, default: '' },
  findings: { type: Object, default: {} },
  status: { type: String, default: 'FINALIZED' },
  createdAt: { type: Date, default: Date.now }
});

// 8. Notification Schema
const NotificationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, enum: ['THREAT_ALERT', 'IOC_EXTRACTED', 'CASE_UPDATE', 'REPORT_READY'], default: 'THREAT_ALERT' },
  caseId: { type: String },
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', UserSchema);
const Case = mongoose.model('Case', CaseSchema);
const Email = mongoose.model('Email', EmailSchema);
const ThreatResult = mongoose.model('ThreatResult', ThreatResultSchema);
const IOC = mongoose.model('IOC', IOCSchema);
const TimelineEvent = mongoose.model('TimelineEvent', TimelineEventSchema);
const Report = mongoose.model('Report', ReportSchema);
const Notification = mongoose.model('Notification', NotificationSchema);

module.exports = {
  User,
  Case,
  Email,
  ThreatResult,
  IOC,
  TimelineEvent,
  Report,
  Notification
};
