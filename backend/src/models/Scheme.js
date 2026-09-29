const mongoose = require('mongoose');

const schemeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  category: {
    type: String,
    default: 'ST'
  },
  incomeLimit: {
    type: Number,
    required: true,
    default: 250000 // In INR per annum
  },
  minPercentage: {
    type: Number,
    required: true,
    default: 50.0 // Minimum academic percentage / CGPA equivalent
  },
  approvedCourses: [{
    type: String,
    trim: true
  }],
  approvedInstitutions: [{
    type: String,
    trim: true
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Scheme', schemeSchema);
