const mongoose = require('mongoose');
const crypto = require('crypto');

const applicationSchema = new mongoose.Schema({
  applicationNumber: {
    type: String,
    unique: true,
    required: true,
    index: true
  },
  applicantName: {
    type: String,
    required: true,
    trim: true
  },
  dob: {
    type: String,
    required: true,
    trim: true
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Transgender', 'Other'],
    default: 'Male'
  },
  category: {
    type: String,
    default: 'ST',
    required: true
  },
  subTribe: {
    type: String,
    default: 'Munda',
    trim: true
  },
  aadhaarNumberMasked: {
    type: String,
    required: true,
    trim: true
  },
  aadhaarHash: {
    type: String,
    index: true
  },
  income: {
    type: Number,
    required: true,
    default: 120000
  },
  course: {
    type: String,
    required: true,
    trim: true
  },
  institution: {
    type: String,
    required: true,
    trim: true
  },
  academicPercentage: {
    type: Number,
    default: 75.0
  },
  bankAccountNumber: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  ifscCode: {
    type: String,
    required: true,
    trim: true,
    uppercase: true
  },
  bankName: {
    type: String,
    default: 'State Bank of India'
  },
  schemeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Scheme',
    required: true
  },
  status: {
    type: String,
    enum: [
      'draft',
      'submitted',
      'under_review',
      'verified',
      'approved',
      'rejected',
      'resubmission_requested'
    ],
    default: 'submitted',
    index: true
  },
  riskScore: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  riskLevel: {
    type: String,
    enum: ['LOW', 'MEDIUM', 'HIGH'],
    default: 'LOW'
  },
  officerDecision: {
    officerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    officerName: { type: String, default: '' },
    decision: { type: String, enum: ['APPROVED', 'REJECTED', 'RESUBMIT', 'NONE'], default: 'NONE' },
    comment: { type: String, default: '' },
    decidedAt: { type: Date }
  },
  isLocked: {
    type: Boolean,
    default: false
  },
  submittedAt: {
    type: Date,
    default: Date.now,
    index: true
  }
});

// Pre-save hook to hash Aadhaar for duplicate detection without exposing raw Aadhaar
applicationSchema.pre('save', function (next) {
  if (this.isModified('aadhaarNumberMasked') && !this.aadhaarHash) {
    this.aadhaarHash = crypto.createHash('sha256').update(this.aadhaarNumberMasked).digest('hex');
  }
  next();
});

module.exports = mongoose.model('Application', applicationSchema);
