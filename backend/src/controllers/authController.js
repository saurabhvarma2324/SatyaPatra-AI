const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = require('../models/User');
const { logAudit } = require('../middleware/authMiddleware');
const { store } = require('../services/memoryStore');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'satyapatra_secret_jwt_key_2026_gov', {
    expiresIn: '7d'
  });
};

// @desc    Register a new user
// @route   POST /api/auth/signup
// @access  Public
const signup = async (req, res) => {
  try {
    const { name, email, password, role, designation, department } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide name, email, and password' });
    }

    const lowerEmail = email.toLowerCase().trim();

    // Check in DB or Memory
    let existingUser = null;
    if (mongoose.connection.readyState === 1) {
      try {
        existingUser = await User.findOne({ email: lowerEmail });
      } catch (e) {
        existingUser = store.users.find((u) => u.email.toLowerCase() === lowerEmail);
      }
    } else {
      existingUser = store.users.find((u) => u.email.toLowerCase() === lowerEmail);
    }

    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User already exists with this email' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    let user;
    if (mongoose.connection.readyState === 1) {
      try {
        user = await User.create({
          name,
          email: lowerEmail,
          passwordHash,
          role: role || 'officer',
          designation: designation || 'Verification Officer',
          department: department || 'Ministry of Tribal Affairs'
        });
      } catch (e) {
        user = {
          _id: 'usr_' + Date.now(),
          name,
          email: lowerEmail,
          passwordHash,
          role: role || 'officer',
          designation: designation || 'Verification Officer',
          department: department || 'Ministry of Tribal Affairs',
          matchPassword: async function(enteredPassword) {
            return await bcrypt.compare(enteredPassword, this.passwordHash);
          }
        };
        store.users.push(user);
      }
    } else {
      user = {
        _id: 'usr_' + Date.now(),
        name,
        email: lowerEmail,
        passwordHash,
        role: role || 'officer',
        designation: designation || 'Verification Officer',
        department: department || 'Ministry of Tribal Affairs',
        matchPassword: async function(enteredPassword) {
          return await bcrypt.compare(enteredPassword, this.passwordHash);
        }
      };
      store.users.push(user);
    }

    const token = generateToken(user._id);
    req.user = user;
    await logAudit(req, 'USER_SIGNUP', null, { role: user.role, email: user.email });

    res.status(201).json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        designation: user.designation,
        department: user.department
      }
    });
  } catch (err) {
    console.error('Signup Error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const lowerEmail = email.toLowerCase().trim();
    let user = null;

    if (mongoose.connection.readyState === 1) {
      try {
        user = await User.findOne({ email: lowerEmail });
      } catch (e) {
        user = store.users.find((u) => u.email.toLowerCase() === lowerEmail);
      }
    } else {
      user = store.users.find((u) => u.email.toLowerCase() === lowerEmail);
    }

    // Secondary fallback to in-memory store if DB query returned null
    if (!user) {
      user = store.users.find((u) => u.email.toLowerCase() === lowerEmail);
    }

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const isMatch = typeof user.matchPassword === 'function'
      ? await user.matchPassword(password)
      : await bcrypt.compare(password, user.passwordHash);

    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const token = generateToken(user._id);
    req.user = user;
    await logAudit(req, 'USER_LOGIN', null, { email: user.email, role: user.role });

    res.json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        designation: user.designation,
        department: user.department
      }
    });
  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    res.json({
      success: true,
      user: req.user
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { signup, login, getMe };

