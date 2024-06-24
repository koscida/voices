const express = require("express");
const actorController = require("../controllers/actorController");

const router = express.Router();

router
	.route("/actor")
	.get(actorController.getSingle)
	.post(actorController.createSingle);

router.route("/actor/:id").get(actorController.getSingleById);

module.exports = router;
