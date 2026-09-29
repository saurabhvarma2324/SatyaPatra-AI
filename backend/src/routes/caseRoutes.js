const express = require('express');
const router = express.Router();
const { getCases, getCaseById, createCase, updateCase, addNote } = require('../controllers/caseController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getCases);
router.get('/:id', protect, getCaseById);
router.post('/', protect, createCase);
router.put('/:id', protect, updateCase);
router.post('/:id/notes', protect, addNote);

module.exports = router;
