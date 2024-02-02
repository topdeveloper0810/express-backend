const express = require("express");
const authController = require("../../controllers/authController");
const verifyCode = require("../../controllers/verifyCode");
const requiredAuth = require("../../middlewares/requiredAuth");
const requiredVerify = require("../../middlewares/requiredVerify");

const router = express.Router();

router.post("/register", authController.register);
router.post("/sendcode", verifyCode.sendCode);
router.post("/verifycode", verifyCode.verifyCode);
router.post("/login", requiredVerify, authController.login);
router.post("/logout", requiredAuth, authController.logout);

module.exports = router;
