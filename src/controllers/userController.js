const User = require("../models/User");

const test = async (req, res) => {
  await res.status(200).json({ msg: "User is running" });
};

// @route   POST api/v1/user/me
// @desc    Get user
// @access  Public
const me = async (req, res) => {
  const user = req.user;
  await res.status(200).json({
    success: true,
    data: { user },
  });
};

// @route   POST api/v1/user/all
// @desc    Get all user
// @access  Private
const all = async (req, res) => {
  await User.find()
    .sort({ date: 1 })
    .then((users) => res.status(200).json({ success: true, data: { users } }))
    .catch((err) => res.status(403).json({ msg: "No users found." }));
};

module.exports = { test, me, all };
