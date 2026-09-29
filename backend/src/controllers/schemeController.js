const mongoose = require('mongoose');
const Scheme = require('../models/Scheme');
const { logAudit } = require('../middleware/authMiddleware');
const { store } = require('../services/memoryStore');

// @desc    Get all active scholarship schemes
// @route   GET /api/schemes
// @access  Public / Authenticated
const getSchemes = async (req, res) => {
  try {
    let schemes = [];
    if (mongoose.connection.readyState === 1) {
      try {
        schemes = await Scheme.find().sort({ createdAt: -1 });
      } catch (e) {
        schemes = store.schemes;
      }
    } else {
      schemes = store.schemes;
    }

    if (!schemes || schemes.length === 0) {
      schemes = store.schemes;
    }

    res.json({ success: true, schemes });
  } catch (err) {
    res.json({ success: true, schemes: store.schemes });
  }
};

// @desc    Create a new scholarship scheme
// @route   POST /api/schemes
// @access  Admin Only
const createScheme = async (req, res) => {
  try {
    const { name, code, description, incomeLimit, minPercentage, category, approvedCourses, approvedInstitutions } = req.body;

    if (!name || !code || incomeLimit === undefined) {
      return res.status(400).json({ success: false, message: 'Please provide scheme name, code, and income limit' });
    }

    const schemeCode = code.toUpperCase().trim();
    const courses = Array.isArray(approvedCourses) ? approvedCourses : (approvedCourses ? approvedCourses.split(',').map(s => s.trim()) : []);
    const insts = Array.isArray(approvedInstitutions) ? approvedInstitutions : (approvedInstitutions ? approvedInstitutions.split(',').map(s => s.trim()) : []);

    let scheme = null;
    if (mongoose.connection.readyState === 1) {
      try {
        const existing = await Scheme.findOne({ code: schemeCode });
        if (existing) {
          return res.status(400).json({ success: false, message: 'Scheme with this code already exists' });
        }

        scheme = await Scheme.create({
          name,
          code: schemeCode,
          description,
          incomeLimit: Number(incomeLimit),
          minPercentage: Number(minPercentage) || 50.0,
          category: category || 'ST',
          approvedCourses: courses,
          approvedInstitutions: insts,
          isActive: true
        });
      } catch (e) {
        scheme = {
          _id: 'sch_' + Date.now(),
          name,
          code: schemeCode,
          description,
          incomeLimit: Number(incomeLimit),
          minPercentage: Number(minPercentage) || 50.0,
          category: category || 'ST',
          approvedCourses: courses,
          approvedInstitutions: insts,
          isActive: true,
          createdAt: new Date()
        };
        store.schemes.unshift(scheme);
      }
    } else {
      scheme = {
        _id: 'sch_' + Date.now(),
        name,
        code: schemeCode,
        description,
        incomeLimit: Number(incomeLimit),
        minPercentage: Number(minPercentage) || 50.0,
        category: category || 'ST',
        approvedCourses: courses,
        approvedInstitutions: insts,
        isActive: true,
        createdAt: new Date()
      };
      store.schemes.unshift(scheme);
    }

    await logAudit(req, 'SCHEME_CREATED', null, { schemeCode: scheme.code, schemeName: scheme.name });

    res.status(201).json({ success: true, scheme });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Update scholarship scheme
// @route   PUT /api/schemes/:id
// @access  Admin Only
const updateScheme = async (req, res) => {
  try {
    let scheme = null;
    if (mongoose.connection.readyState === 1) {
      try {
        scheme = await Scheme.findById(req.params.id);
        if (scheme) {
          const { name, description, incomeLimit, minPercentage, approvedCourses, approvedInstitutions, isActive } = req.body;
          if (name !== undefined) scheme.name = name;
          if (description !== undefined) scheme.description = description;
          if (incomeLimit !== undefined) scheme.incomeLimit = Number(incomeLimit);
          if (minPercentage !== undefined) scheme.minPercentage = Number(minPercentage);
          if (approvedCourses !== undefined) scheme.approvedCourses = Array.isArray(approvedCourses) ? approvedCourses : approvedCourses.split(',').map(s => s.trim());
          if (approvedInstitutions !== undefined) scheme.approvedInstitutions = Array.isArray(approvedInstitutions) ? approvedInstitutions : approvedInstitutions.split(',').map(s => s.trim());
          if (isActive !== undefined) scheme.isActive = isActive;
          await scheme.save();
        }
      } catch (e) {
        scheme = store.schemes.find(s => String(s._id) === String(req.params.id));
      }
    } else {
      scheme = store.schemes.find(s => String(s._id) === String(req.params.id));
    }

    if (!scheme) {
      scheme = store.schemes.find(s => String(s._id) === String(req.params.id));
    }

    if (!scheme) {
      return res.status(404).json({ success: false, message: 'Scheme not found' });
    }

    const { name, description, incomeLimit, minPercentage, approvedCourses, approvedInstitutions, isActive } = req.body;
    if (name !== undefined) scheme.name = name;
    if (description !== undefined) scheme.description = description;
    if (incomeLimit !== undefined) scheme.incomeLimit = Number(incomeLimit);
    if (minPercentage !== undefined) scheme.minPercentage = Number(minPercentage);
    if (approvedCourses !== undefined) scheme.approvedCourses = Array.isArray(approvedCourses) ? approvedCourses : approvedCourses.split(',').map(s => s.trim());
    if (approvedInstitutions !== undefined) scheme.approvedInstitutions = Array.isArray(approvedInstitutions) ? approvedInstitutions : approvedInstitutions.split(',').map(s => s.trim());
    if (isActive !== undefined) scheme.isActive = isActive;

    await logAudit(req, 'SCHEME_UPDATED', null, { schemeCode: scheme.code, schemeName: scheme.name });

    res.json({ success: true, scheme });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getSchemes, createScheme, updateScheme };
