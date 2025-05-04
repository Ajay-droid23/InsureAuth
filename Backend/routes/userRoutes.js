const express = require('express');
const { updateUser, changePassword, getUser, requestPasswordReset, verifyResetOTP, resetPassword } = require('../controllers/userController');
const authenticateJWT = require('../utils/authMiddleware');
const multer = require('multer');
const path = require('path');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/profile-pictures');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

router.put('/user/:email', authenticateJWT, upload.single('profilePicture'), updateUser);
router.put('/user/:email/change-password', authenticateJWT, changePassword);
router.get('/user/:email', authenticateJWT, getUser);
router.post('/request-password-reset', requestPasswordReset);
router.post('/verify-reset-otp', verifyResetOTP);
router.post('/reset-password', resetPassword);

module.exports = router;
