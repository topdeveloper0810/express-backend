const express = require("express");
const router = express.Router();

const userController = require("../../controllers/userController");
const requireAuth = require("../../middlewares/requiredAuth");
const requiredAdmin = require("../../middlewares/requiredAdmin");

router.get("/test", userController.test);
router.get("/me", requireAuth, userController.me);
router.get("/all", requireAuth, requiredAdmin, userController.all);

module.exports = router;
