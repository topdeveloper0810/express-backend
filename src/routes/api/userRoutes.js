const express = require("express");
const userController = require("../../controllers/userController");
const requireAuth = require("../../middlewares/requiredAuth");
const requiredAdmin = require("../../middlewares/requiredAdmin");

const router = express.Router();

router.get("/test", userController.test);
router.get("/me", requireAuth, userController.me);
router.get("/all", requireAuth, requiredAdmin, userController.all);

module.exports = router;
