const express = require("express");
const authController = require("../../controllers/authController");
const verifyCode = require("../../controllers/verifyCode");
const requiredAuth = require("../../middlewares/requiredAuth");

const router = express.Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/logout", requiredAuth, authController.logout);
router.post("/sendcode", verifyCode.sendVerifyCode);
router.post("/verifycode", verifyCode.verifyCode);

module.exports = router;
