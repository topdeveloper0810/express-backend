const { Router } = require("express");
const userRoutes = require("./userRoutes");
const authRoutes = require("./authRoutes");

const router = Router();

router.use("/user", userRoutes);
router.use("/auth", authRoutes);

module.exports = router;
