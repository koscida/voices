const express = require("express");
const mediaController = require("../controllers/mediaController");

const router = express.Router();

router.get("/media", mediaController.mediaView);

module.exports = router;
