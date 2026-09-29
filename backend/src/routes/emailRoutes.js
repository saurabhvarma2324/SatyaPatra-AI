const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { uploadAndAnalyze, getSampleEmails, loadSample } = require('../controllers/emailController');
const { protect } = require('../middleware/auth');

// Setup multer storage
const uploadsDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 }, // 25MB limit
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext === '.eml' || ext === '.msg' || ext === '.txt' || file.mimetype === 'message/rfc822' || file.mimetype === 'text/plain') {
      cb(null, true);
    } else {
      cb(new Error('Only .eml or standard email message files are supported.'));
    }
  }
});

router.post('/upload', protect, upload.single('emailFile'), uploadAndAnalyze);
router.get('/samples', protect, getSampleEmails);
router.post('/load-sample', protect, loadSample);

module.exports = router;
