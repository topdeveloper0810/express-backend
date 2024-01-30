const { Router } = require("express");
const userController = require("../../controllers/userController");

const router = Router();

router.get("/test", userController.test);
router.post("/register", userController.register);
router.post("/login", userController.login);

module.exports = router;
