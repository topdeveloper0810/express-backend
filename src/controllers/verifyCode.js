const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const User = require("../models/User");

dotenv.config();

const secretOrKey = process.env.JWT_ACCESS_TOKEN_SECRET_PRIVATE;

const sendCode = async (req, res) => {
  const { email } = req.body;
  try {
    await User.findOne({ email: email })
      .then((user) => {
        if (!user) {
          res.status(400).json({ msg: "This email is not exist." });
        } else {
          const VERIFY_CODE = Math.floor(100000 + Math.random() * 900000);
          user.vCode = VERIFY_CODE;
          user
            .save()
            .then()
            .catch((error) =>
              res.status(400).json({ msg: "User vCode is not saved", err: error })
            );
          const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: false,
            auth: {
              user: process.env.SMTP_USERNAME,
              pass: process.env.SMTP_PASSWORD,
            },
            // service: "gmail",
          });
          process.env.GENERATED_TIME = Date.now();
          const mailOptions = {
            from: `${process.env.APP_NAME} <${process.env.EMAIL_FROM}>`,
            to: email,
            subject: `Your verification code is ${VERIFY_CODE}`,
            text: "code",
            html: `<h1>Verify your email address</h1>
          <hr><h3>Please enter this 6-digit code to access our platform.</h3>
          <h1>${VERIFY_CODE}</h1>`,
          };
          transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
              console.log(err);
              res.status(500).json({ msg: err });
            } else {
              // create JWT payload
              const payload = {
                _id: user._id,
                email: user.email,
                vCode: user.vCode,
              };
              // sign token
              jwt.sign(
                payload,
                secretOrKey,
                // { expiresIn: expiresIn },
                (err, token) => {
                  res.status(200).json({
                    success: true,
                    msg: "Email sent successfully",
                    data: { vCode: user.vCode, token: "Bearer " + token },
                  });
                }
              );
            }
          });
        }
      })
      .catch((error) =>
        res
          .status(500)
          .json({ msg: "User verify error", err: error })
      );
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ msg: "Send verify Code error", err: error });
  }
};

const verifyCode = async (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  const { vCode } = req.body;
  if (!token) {
    return res.status(401).json({ msg: "No verify token." });
  }
  try {
    await jwt.verify(token, secretOrKey, (error, decode) => {
      if (error) {
        return res.status(401).json({ msg: "Verify token is not valid." });
      } else {
        if (decode.vCode == vCode) {
          User.findById(decode._id).then((user) => {
            user.vCode = 1;
            user
              .save()
              .then(() => {
                res.status(200).json({ success: true, vCode: user.vCode, data: "Verify Passed." });
              })
              .catch((error) => console.log("User vCode => 1 : ", error));
          });
        } else {
          res
            .status(400)
            .json({vCode, msg: "The code is incorrect, try again" });
        }
      }
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ msg: "Verify code error.", err: error });
  }
};

module.exports = { sendCode, verifyCode };
