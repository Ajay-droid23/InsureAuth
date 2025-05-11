const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { sendOTPEmail, getRegisterMailTemplate } = require('../services/emailService');
const { generateOTP } = require('../services/otpService');

const secretKey = process.env.JWT_SECRET || 'your-very-secure-secret-key';


exports.login = async (req, res) => {
  const { email, password } = req.body;
  
  try {
    // Find user and include password field
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check if user is verified
    if (!user.verified) {
      return res.status(403).json({
        success: false,
        message: 'Account not verified. Please verify your email first.'
      });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Create JWT token
    const token = jwt.sign(
      { 
        userId: user._id,
        email: user.email,
        role: user.role 
      },
      secretKey,
      { expiresIn: '1h' }
    );

    // Return user data (without sensitive info)
    const userData = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      gender: user.gender,
      profilePicture: user.profilePicture
    };

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: userData
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Error during login',
      error: error.message
    });
  }
};

// Send OTP to email
exports.sendOTP = async (req, res) => {
  const { email } = req.body;
  
  try {
    const otp = generateOTP();
    const otpExpiry = Date.now() + 5 * 60 * 1000; // 5 minutes expiry

    let user = await User.findOne({ email });

    if (!user) {
      // Create new user if doesn't exist
      user = new User({
        email,
        otp,
        otpExpiry,
        verified: false
      });
    } else {
      // Update existing user's OTP
      user.otp = otp;
      user.otpExpiry = otpExpiry;
      user.verified = false;
    }

    await user.save();
    
    // Send OTP email
    await sendOTPEmail(email, otp);

    res.status(200).json({
      success: true,
      message: 'OTP sent successfully',
      email
    });
  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send OTP',
      error: error.message
    });
  }
};

// Verify OTP
exports.verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ 
      email,
      otp,
      otpExpiry: { $gt: Date.now() } // Check OTP not expired
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired OTP'
      });
    }

    // Mark as verified and clear OTP
    user.verified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'OTP verified successfully',
      email
    });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify OTP',
      error: error.message
    });
  }
};

// User Signup
exports.signup = async (req, res) => {
  const { name, email, gender, role, password } = req.body;

  try {
    // Check if user exists and is verified
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'OTP not sent to this email'
      });
    }

    if (!user.verified) {
      return res.status(403).json({
        success: false,
        message: 'Email not verified'
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Update user with profile data
    user.name = name;
    user.gender = gender;
    user.role = role;
    user.password = hashedPassword;
    await user.save();

    // Send welcome email
    await getRegisterMailTemplate(email, role);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
        gender: user.gender
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({
      success: false,
      message: 'Error during registration',
      error: error.message
    });
  }
};

// Password Reset - Request OTP
exports.requestPasswordReset = async (req, res) => {
  const { email } = req.body;
  
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const otp = generateOTP();
    const otpExpiry = Date.now() + 5 * 60 * 1000; // 5 minutes expiry

    user.resetPasswordOTP = otp;
    user.resetPasswordOTPExpiry = otpExpiry;
    user.resetPasswordVerified = false;
    await user.save();

    await sendOTPEmail(email, otp);

    res.status(200).json({
      success: true,
      message: 'Password reset OTP sent',
      email
    });
  } catch (error) {
    console.error('Password reset request error:', error);
    res.status(500).json({
      success: false,
      message: 'Error requesting password reset',
      error: error.message
    });
  }
};

// Password Reset - Verify OTP
exports.verifyResetOTP = async (req, res) => {
  const { email, otp } = req.body;
  
  try {
    const user = await User.findOne({ 
      email,
      resetPasswordOTP: otp,
      resetPasswordOTPExpiry: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired OTP'
      });
    }

    user.resetPasswordVerified = true;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'OTP verified successfully',
      email
    });
  } catch (error) {
    console.error('Password reset OTP verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Error verifying OTP',
      error: error.message
    });
  }
};

// Password Reset - Set New Password
exports.resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;
  
  try {
    const user = await User.findOne({ 
      email,
      resetPasswordVerified: true 
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'OTP not verified or session expired'
      });
    }

    // Hash and update password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    user.resetPasswordOTP = undefined;
    user.resetPasswordOTPExpiry = undefined;
    user.resetPasswordVerified = false;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password reset successfully'
    });
  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({
      success: false,
      message: 'Error resetting password',
      error: error.message
    });
  }
};

// Resend OTP
exports.resendOTP = async (req, res) => {
  const { email } = req.body;
  
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const otp = generateOTP();
    const otpExpiry = Date.now() + 5 * 60 * 1000; // 5 minutes expiry

    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();

    await sendOTPEmail(email, otp);

    res.status(200).json({
      success: true,
      message: 'OTP resent successfully',
      email
    });
  } catch (error) {
    console.error('Resend OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Error resending OTP',
      error: error.message
    });
  }
};