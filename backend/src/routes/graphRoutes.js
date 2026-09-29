const express = require('express');
const router = express.Router();
const { getGraphByCaseId } = require('../controllers/graphController');
const { protect } = require('../middleware/auth');

router.get('/:caseId', protect, getGraphByCaseId);

module.exports = router;
