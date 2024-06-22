const express = require("express");
const authController = require("../controllers/authController");

const router = express.Router();

router.get("/", authController.homeView);
router.get("/api", authController.homeView);

module.exports = router;
