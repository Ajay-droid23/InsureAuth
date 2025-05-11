const User = require('../models/User');
const bcrypt = require('bcryptjs');
const path = require('path');

// Get user profile
exports.getUser = async (req, res) => {
  try {
    // Verify the requested email matches the token's email
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
      gender: user.gender,
      role: user.role,
      profilePicture: user.profilePicture
    });
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ error: 'Error fetching user data' });
  }
};

// Update user profile
exports.updateUser = async (req, res) => {
  try {
    if (req.params.email !== req.user.email) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const updates = {};
    if (req.body.name) updates.name = req.body.name;
    if (req.body.gender) updates.gender = req.body.gender;
    
    // Handle profile picture upload
    if (req.file) {
      updates.profilePicture = `/profile-pictures/${req.file.filename}`;
    }

    const user = await User.findOneAndUpdate(
      { email: req.params.email },
      { $set: updates },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      name: user.name,
      email: user.email,
      gender: user.gender,
      profilePicture: user.profilePicture
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Error updating user' });
  }
};

// Change user password
exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    
    if (req.params.email !== req.user.email) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const user = await User.findOne({ email: req.params.email }).select('+password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Verify old password
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Old password is incorrect' });
    }

    // Hash and save new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ error: 'Error changing password' });
  }
};