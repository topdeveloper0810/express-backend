const { Router } = require("express");
const authController = require("../../controllers/authController")
const requiredAuth = require("../../middlewares/requiredAuth");

const router = Router();

router.get("/free", authController.free);
router.get("/test", requiredAuth, authController.test);

module.exports = router;
