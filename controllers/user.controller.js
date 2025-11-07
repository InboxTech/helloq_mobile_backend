const User = require('../models/User');

const updateProfile = async (req, res) => {
  const updates = req.body;
  const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true });
  res.json(user);
};

const getProfile = async (req, res) => {
  const user = await User.findById(req.user._id).select('-__v');
  res.json(user);
};

module.exports = { updateProfile, getProfile };