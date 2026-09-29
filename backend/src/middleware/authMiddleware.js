const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/User');
const AuditLog = require('../models/AuditLog');
const { store } = require('../services/memoryStore');

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'satyapatra_secret_jwt_key_2026_gov');
      
      let user = null;
      if (mongoose.connection.readyState === 1) {
        try {
          user = await User.findById(decoded.id).select('-passwordHash');
        } catch (e) {
          user = store.users.find(u => String(u._id) === String(decoded.id));
        }
      } else {
        user = store.users.find(u => String(u._id) === String(decoded.id));
      }

      if (!user) {
        user = store.users.find(u => String(u._id) === String(decoded.id));
      }

      if (!user) {
        return res.status(401).json({ success: false, message: 'User not found' });
      }

      req.user = user;
      return next();
    } catch (error) {
      console.error('JWT Auth Error:', error.message);
      return res.status(401).json({ success: false, message: 'Invalid or expired token' });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
  }
};

const optionalProtect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'satyapatra_secret_jwt_key_2026_gov');
      
      let user = null;
      if (mongoose.connection.readyState === 1) {
        try {
          user = await User.findById(decoded.id).select('-passwordHash');
        } catch (e) {
          user = store.users.find(u => String(u._id) === String(decoded.id));
        }
      } else {
        user = store.users.find(u => String(u._id) === String(decoded.id));
      }

      if (!user) {
        user = store.users.find(u => String(u._id) === String(decoded.id));
      }

      if (user) {
        req.user = user;
        return next();
      }
    } catch (error) {
      // Token invalid, fall back to applicant role
    }
  }

  // Default to applicant role if unauthenticated for public applicant endpoints
  req.user = { _id: 'guest_applicant', name: 'Applicant', role: 'applicant' };
  return next();
};

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Role '${req.user ? req.user.role : 'unauthenticated'}' is not authorized to access this resource`
      });
    }
    next();
  };
};

const logAudit = async (req, action, targetApplicationId = null, details = {}) => {
  try {
    const userId = req.user ? req.user._id : null;
    const userName = req.user ? req.user.name : 'Anonymous / System';
    const role = req.user ? req.user.role : 'public';
    const ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';

    const logEntry = {
      _id: 'log_' + Date.now() + Math.random().toString(36).substr(2, 4),
      userId,
      userName,
      role,
      action,
      targetApplicationId,
      details,
      ipAddress,
      timestamp: new Date()
    };

    if (mongoose.connection.readyState === 1) {
      try {
        await AuditLog.create(logEntry);
      } catch (e) {
        store.auditLogs.unshift(logEntry);
      }
    } else {
      store.auditLogs.unshift(logEntry);
    }
  } catch (err) {
    console.error('Failed to write audit log:', err.message);
  }
};

module.exports = { protect, optionalProtect, authorizeRoles, logAudit };
