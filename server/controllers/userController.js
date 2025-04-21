const User = require('../models/userModel');

// Create user controller
exports.createUser = async (req, res) => {
  try {
    const userId = await User.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        userId
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};

// Update user controller
// Update user controller
exports.updateUser = async (req, res) => {
  try {
    const { email, first_name, last_name, phone } = req.body;
    
    // Check if the email exists and update the user
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user data
    await User.update({ first_name, last_name, phone, email });  // Or whatever fields you're updating
    res.status(200).json({
      status: 'success',
      message: 'Profile updated successfully'
    });
  } catch (err) {
    res.status(500).json({
      status: 'fail',
      message: err.message
    });
  }
};


// ✅ Move this outside and export it
exports.getUserByEmail = async (req, res) => {
  const { email } = req.query;
  if (!email) return res.status(400).json({ message: 'Email is required' });

  try {
    const user = await User.findByEmail(email);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error('Error in getUserByEmail:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
