const express = require('express');
const router = express.Router();
const { getReportByCaseId, generateReport, getAllReports } = require('../controllers/reportController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getAllReports);
router.get('/:caseId', protect, getReportByCaseId);
router.post('/:caseId', protect, generateReport);

module.exports = router;
