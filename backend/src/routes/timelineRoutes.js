const express = require('express');
const router = express.Router();
const { getTimelineByCaseId, getAllTimeline } = require('../controllers/timelineController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getAllTimeline);
router.get('/:caseId', protect, getTimelineByCaseId);

module.exports = router;
