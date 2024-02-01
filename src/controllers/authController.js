const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const User = require("../models/User");

dotenv.config();
const secretOrKey = process.env.JWT_ACCESS_TOKEN_SECRET_PRIVATE;
const expiresIn = process.env.JWT_ACCESS_TOKEN_EXPIRATION_MINUTES;

const test = async (req, res) => {
  await res.status(200).json({ msg: "Auth is running." });
};

// @route   POST api/users/register
// @desc    Register a user
// @access  Public
const register = async (req, res) => {
  const { name, email, password, role } = req.body;

  await User.findOne({ email }).then((user) => {
    if (user) {
      // errors.email = "Email already exists.";
      // don't proceed because the user exists
      return res.status(400).json({ msg: "Email already exists." });
    } else {
      // if user doesn't exist, create new User
      const newUser = new User({
        name: name,
        email: email,
        password: password,
        role: role,
      });
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then((user) =>
              res.status(200).json({ success: true, data: { user } })
            )
            .catch((err) => console.log(err));
        });
      });
    }
  });
};

// @route   POST api/v1/auth/login
// @desc    Login a user
// @access  Public
const login = async (req, res) => {
  const { email, password } = req.body;

  // find user by email
  await User.findOne({ email }).then((user) => {
    // check for user
    if (!user) {
      return res.status(400).json({ msg: "User not found." });
    }
    // check for password
    bcrypt.compare(password, user.password).then((isMatch) => {
      if (isMatch) {
        // user matched
        // create JWT payload
        const payload = {
          _id: user._id,
          email: user.email,
        };
        // sign token
        jwt.sign(
          payload,
          secretOrKey,
          { expiresIn: expiresIn },
          (err, token) => {
            res.json({
              success: true,
              data: { user, token: "Bearer " + token },
            });
          }
        );
      } else {
        return res.status(400).json({ msg: "Incorrect password entered." });
      }
    });
  });
};

const logout = async (req, res) => {
  try {
    await res
      .status(200)
      .clearCookie()
      .json({ success: true, msg: "Successfully logouted" });
  } catch (error) {
    await res.status(500).json({ msg: "Server error" });
  }
};

module.exports = { test, register, login, logout };
