const express = require("express");
const mediaController = require("../controllers/mediaController");

const router = express.Router();

// crud
router
	.route("/media")
	.post(mediaController.post)
	.get(mediaController.get)
	.put(mediaController.put);
// 	.delete(mediaController.delete);
router.route("/media/:id").get(mediaController.get).put(mediaController.put);
// 	.delete(mediaController.delete);

// functions
// router.route("/mediaActorHistory").get(mediaController.getActorHistory);

module.exports = router;
