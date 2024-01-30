const { Router } = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const User = require("../../models/User");

dotenv.config();
const secretOrKey = process.env.JWT_ACCESS_TOKEN_SECRET_PRIVATE;
const expiresIn = process.env.JWT_ACCESS_TOKEN_EXPIRATION_MINUTES;
const router = Router();

router.get("/", (req, res) => {
  res.status(200).json("/api/users is running");
});

// @route   POST api/users/register
// @desc    Register a user
// @access  Public
router.post("/register", (req, res) => {
  const { name, email, password, role } = req.body;

  User.findOne({ email }).then((user) => {
    if (user) {
      // errors.email = "Email already exists.";
      // don't proceed because the user exists
      return res.status(400).json("Email already exists.");
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
            .then((user) => res.status(200).json(user))
            .catch((err) => console.log(err));
        });
      });
    }
  });
});

// @route   POST api/users/login
// @desc    Login a user
// @access  Public
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  // find user by email
  User.findOne({ email }).then((user) => {
    // check for user
    if (!user) {
      return res.status(400).json("User not found.");
    }
    // check for password
    bcrypt.compare(password, user.password).then((isMatch) => {
      if (isMatch) {
        // user matched
        // create JWT payload
        const payload = {
          id: user.id,
          name: user.name,
        };
        // sign token
        jwt.sign(
          payload,
          secretOrKey,
          { expiresIn: expiresIn },
          (err, token) => {
            res.json({
              success: true,
              user,
              token: "Bearer " + token,
            });
          }
        );
      } else {
        return res.status(400).json("Incorrect password entered.");
      }
    });
  });
});

module.exports = router;
