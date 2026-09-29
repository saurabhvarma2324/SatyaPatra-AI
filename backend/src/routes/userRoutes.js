const express = require('express');
const router = express.Router();
const { getUsers, createUser, updateUserStatus } = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', protect, authorize('ADMIN'), getUsers);
router.post('/', protect, authorize('ADMIN'), createUser);
router.put('/:id/status', protect, authorize('ADMIN'), updateUserStatus);

module.exports = router;
