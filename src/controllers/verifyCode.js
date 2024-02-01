const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const User = require("../models/User");

dotenv.config();

const sendVerifyCode = async (req, res) => {
  const { email } = req.body;
  try {
    await User.findOne({ email: email }).then((user) => {
      if (!user) {
        res.status(400).json({ msg: "This email is not exist." });
      } else {
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
        process.env.VERIFICATION_CODE = Math.floor(
          100000 + Math.random() * 900000
        );
        process.env.GENERATED_TIME = Date.now();
        const mailOptions = {
          from: `${process.env.APP_NAME} <${process.env.EMAIL_FROM}>`,
          to: email,
          subject: `Your verification code is ${process.env.VERIFICATION_CODE}`,
          text: "code",
          html: `<h1>Verify your email address</h1>
          <hr><h3><p>Please enter this 6-digit code to access our platform.</p></h3>
          <h2>${process.env.VERIFICATION_CODE}</h2>
          <h3><p>This code is valid for 2 minute.</p></h3>`,
        };
        transporter.sendMail(mailOptions, (err, info) => {
          if (err) {
            console.log(err);
            res.status(500).json({ msg: err });
          } else {
            res
              .status(200)
              .json({ success: true, msg: "Email sent successfully" });
          }
        });
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ err: error });
  }
};

const verifyCode = (req, res) => {
  const { verificationCode } = req.body;
  try {
    if (verificationCode === process.env.VERIFICATION_CODE) {
      if (
        Date.now() - process.env.GENERATED_TIME <
        process.env.VALID_DURATION
      ) {
        res.status(200).json({ success: true, data: "Verify Passed" });
      } else {
        res.status(400).json({ msg: "This code is expired, please try again" });
      }
    } else {
      res.status(400).json({ msg: "The code is incorrect, try again" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ err: error });
  }
};

module.exports = { sendVerifyCode, verifyCode };
