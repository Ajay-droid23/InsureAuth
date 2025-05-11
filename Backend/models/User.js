const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, required: true, unique: true },
  gender: String,
  role: String,
  password: { type: String, select: false },
  otp: String,
  otpExpiry: Date,
  resetPasswordOTP: String,
  resetPasswordOTPExpiry: Date, 
  resetPasswordVerified: { type: Boolean, default: false },
  verified: { type: Boolean, default: false },
  profilePicture: String
});

module.exports = mongoose.model('User', userSchema);