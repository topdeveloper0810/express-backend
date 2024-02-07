const express = require("express");
const router = express.Router();

const userRoutes = require("./userRoutes");
const authRoutes = require("./authRoutes");
const schoolRoutes = require("./schoolRoutes");
const qaRoutes = require("./qaRoutes");
const rankRoutes = require("./rankRoutes");

router.use("/auth", authRoutes);
router.use("/user", userRoutes);
router.use("/school", schoolRoutes);
router.use("/qa", qaRoutes);
router.use("/rank", rankRoutes);

module.exports = router;
