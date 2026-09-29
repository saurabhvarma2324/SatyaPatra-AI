const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['officer', 'admin', 'applicant'],
    default: 'officer'
  },
  designation: {
    type: String,
    default: 'Verification Officer'
  },
  department: {
    type: String,
    default: 'Ministry of Tribal Affairs / State Welfare Department'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.passwordHash);
};

module.exports = mongoose.model('User', userSchema);
