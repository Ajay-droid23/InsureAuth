const User = require('../models/User');
const { sendOTPEmail } = require('../utils/emailService');
const generateOTP = require('../utils/otpService');

const updateUser = async (req, res) => {
  try {
    if (req.params.email !== req.user.email) {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    const updates = {};
    if (req.body.name) updates.name = req.body.name;
    if (req.body.vehicleno) updates.vehicleno = req.body.vehicleno;
    if (req.body.gender) updates.gender = req.body.gender;
    if (req.file) updates.profilePicture = `/profile-pictures/${req.file.filename}`;
    const user = await User.findOneAndUpdate({ email: req.params.email }, { $set: updates }, { new: true });
    res.json({ name: user.name, email: user.email, vehicleno: user.vehicleno, gender: user.gender, profilePicture: user.profilePicture });
  } catch (error) {
    res.status(500).json({ error: 'Error updating user' });
  }
};

const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    if (req.params.email !== req.user.email) {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    const user = await User.findOne({ email: req.params.email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    if (user.password !== oldPassword) {
      return res.status(400).json({ error: 'Old password is incorrect' });
    }
    user.password = newPassword;
    await user.save();
    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error changing password' });
  }
};

const getUser = async (req, res) => {
  try {
    if (req.params.email !== req.user.email) {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    const user = await User.findOne({ email: req.params.email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({
      name: user.name,
      email: user.email,
      vehicleno: user.vehicleno,
      gender: user.gender,
      role: user.role,
      profilePicture: user.profilePicture
    });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching user data' });
  }
};

const requestPasswordReset = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const otp = generateOTP();
    user.resetPasswordOTP = otp;
    user.resetPasswordOTPExpiry = Date.now() + 5 * 60 * 1000; // 5 minutes expiry
    await user.save();
    await sendOTPEmail(email, otp);
    res.status(200).json({ message: 'OTP sent to email' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error sending OTP' });
  }
};

const verifyResetOTP = async (req, res) => {
  const { email, otp } = req.body;
  try {
    user = await User.findOne({
      email,
      resetPasswordOTP: otp,
      resetPasswordOTPExpiry: { $gt: Date.now() }
    });
    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }
    user.resetPasswordOTP = null;
    user.resetPasswordOTPExpiry = null;
    user.resetPasswordVerified = true;
    await user.save();
    res.status(200).json({ message: 'OTP verified successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error verifying OTP' });
  }
};

const resetPassword = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({
      email,
      resetPasswordVerified: true
    });
    if (!user) {
      return res.status(400).json({ error: 'OTP not verified or session expired' });
    }
    user.password = password;
    user.resetPasswordVerified = false;
    await user.save();
    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error resetting password' });
  }
};

module.exports = { updateUser, changePassword, getUser, requestPasswordReset, verifyResetOTP, resetPassword };
