const express = require("express");
const mediaController = require("../controllers/mediaController");
const { createCRUDRoutes } = require("./routerHelper");

let router = express.Router();

router = createCRUDRoutes(router, "media", mediaController);

// functions
router.route("/mediaActorHistory").get(mediaController.mediaActorHistory);

module.exports = router;
