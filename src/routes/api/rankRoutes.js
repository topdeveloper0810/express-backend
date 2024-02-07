const express = require("express");
const router = express.Router();

const requiredAuth = require("../../middlewares/requiredAuth");
const rankController = require("../../controllers/rankController");

router.get("/", rankController.test);
router.get("/rankschool", requiredAuth, rankController.rankSchool);
router.get("/rankuser", requiredAuth, rankController.rankUser);

module.exports = router;
