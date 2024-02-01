const User = require("../models/User");

const test = async (req, res) => {
  await res.status(200).json({ msg: "User is running" });
};

const me = async (req, res) => {
  const user = req.user;
  await res.status(200).json({
    success: true,
    data: { user },
  });
};

const all = async (req, res) => {
  await User.find()
    .sort({ date: 1 })
    .then((users) => res.status(200).json({ success: true, data: { users } }))
    .catch((err) => res.status(404).json({ msg: "No users found." }));
};

module.exports = { test, me, all };
