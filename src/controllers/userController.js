const User = require("../models/User");

const test = async (req, res) => {
  await res.status(200).json({ msg: "User is running" });
};

// @route   GET api/v1/user/me
// @desc    Get user
// @access  Public
const me = async (req, res) => {
  try {
    const user = req.user;
    await User.findById(user._id)
      .populate("school", "schoolName")
      .select("-password")
      .then((user) => res.status(200).json({ success: true, data: { user } }))
      .catch((err) => res.status(404).json({ msg: "No user found." }));
  } catch (error) {
    res.status(500).json({ msg: "Server error(About me).", error: error });
  }
};

// @route   GET api/v1/user/all
// @desc    Get all user
// @access  Private
const all = async (req, res) => {
  await User.find()
    .populate("school", "schoolName")
    .select("-password")
    .sort({ date: 1 })
    .then((users) => res.status(200).json({ success: true, data: { users } }))
    .catch((err) => res.status(404).json({ msg: "No users found." }));
};

module.exports = { test, me, all };
