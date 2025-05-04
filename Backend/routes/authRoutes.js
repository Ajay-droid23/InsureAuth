const express = require('express');
const { signup, login, sendOTP, verifyOTP } = require('../controllers/authController');
const { body } = require('express-validator');

const router = express.Router();

router.post('/signup', [
  body('email').isEmail(),
  body('password').isLength({ min: 6 })
], signup);

router.post('/login', login);
router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTP);

module.exports = router;
