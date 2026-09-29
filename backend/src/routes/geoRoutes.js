const express = require('express');
const router = express.Router();
const { getGeoByCaseId, getAllGeo } = require('../controllers/geoController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getAllGeo);
router.get('/:caseId', protect, getGeoByCaseId);

module.exports = router;
