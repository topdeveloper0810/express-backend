const User = require("../models/User");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const secretOrKey = process.env.JWT_ACCESS_TOKEN_SECRET_PRIVATE;

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

// @route   POST api/v1/user/admin
// @desc    Post admin
// @access  Privat
const changeAdmin = async (req, res) => {
  try {
    const user = req.user;
    const { name, email, avatar } = req.body;
    const oldAdmin = await User.findById(user._id);
    if (!oldAdmin) {
      res.status(404).json({ msg: "Admin not found." });
    }

    oldAdmin.name = name;
    oldAdmin.email = email;
    oldAdmin.avatar = avatar;
    await oldAdmin
      .save()
      .then(() => res.status(200).json({ success: true, data: { oldAdmin } }))
      .catch((err) =>
        res.status(400).json({ msg: "Admin save error.", err: err.message })
      );
  } catch (error) {
    res
      .status(500)
      .json({ msg: "Server error(Change admin).", error: error.message });
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

module.exports = { test, me, all, changeAdmin };
