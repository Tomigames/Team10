// Kunju Menon - sxm22026
// import user model
const User = require('../models/userModel');

// create user controller
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