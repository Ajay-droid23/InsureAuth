const User = require('../models/User');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const generateOTP = require('../utils/otpService');
const { sendOTPEmail, getRegisterMailTemplate } = require('../utils/emailService');

const secretKey = process.env.JWT_SECRET || 'your-very-secure-secret-key';

const signup = async (req, res) => {
  const { name, email, vehicleno, gender, role, password } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).send('OTP not sent.');
    if (!user.verified) return res.status(403).send('OTP not verified.');

    user.name = name;
    user.vehicleno = vehicleno;
    user.gender = gender;
    user.role = role;
    user.password = password;
    await user.save();
    res.status(201).send('User registered successfully');
    await getRegisterMailTemplate(email);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error registering user');
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email, password });
    if (user) {
      const token = jwt.sign({ email: user.email, role: user.role }, secretKey, { expiresIn: '1h' });
    res.status(200).json({ user: { name: user.name, email: user.email, vehicleno: user.vehicleno, gender: user.gender }, token });
    } else {
      res.status(401).send('Invalid email or password');
    }
  } catch (error) {
    res.status(500).send('Error logging in');
  }
};

const sendOTP = async (req, res) => {
  const { email } = req.body;
  const otp = generateOTP();
  const otpExpiry = Date.now() + 5 * 60 * 1000;
  try {
    let user = await User.findOne({ email });
    if (user && user.name && user.password) {
      return res.status(400).send('User already exists');
    }
    if (!user) {
      user = new User({ email, otp, otpExpiry, verified: false });
    } else {
      user.otp = otp;
      user.otpExpiry = otpExpiry;
      user.verified = false;
    }
    await user.save();
    await sendOTPEmail(email, otp);
    res.status(200).send('OTP sent to email.');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error sending OTP');
  }
};

const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user && user.otp === otp && user.otpExpiry > Date.now()) {
      user.verified = true;
      user.otp = null;
      user.otpExpiry = null;
      await user.save();
      res.status(200).send('OTP verified successfully');
    } else {
      res.status(400).send('Invalid or expired OTP');
    }
  } catch (error) {
    res.status(500).send('Error verifying OTP');
  }
};

module.exports = { signup, login, sendOTP, verifyOTP };
