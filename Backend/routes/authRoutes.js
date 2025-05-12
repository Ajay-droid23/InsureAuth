const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const {sendOTP, verifyOTP, resendOTP,signup,login,verifyResetOTP,requestPasswordReset,resetPassword,resendResetOTP} = require('../controllers/authController');
const { body } = require('express-validator');
const { signupValidator } = require('../utils/validators');

router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTP);
router.post('/resend-otp', resendOTP);
router.post('/signup', signupValidator, signup);
router.post('/login', login);
router.post('/request-password-reset',requestPasswordReset);
router.post('/verify-reset-otp', verifyResetOTP);
router.post('/reset-password', resetPassword);


module.exports = router;