const express = require('express');
const router = express.Router();
const { getIOCs, getIOCsByCaseId, getIOCEnrichment } = require('../controllers/iocController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getIOCs);
router.get('/enrich', protect, getIOCEnrichment);
router.get('/:caseId', protect, getIOCsByCaseId);

module.exports = router;
