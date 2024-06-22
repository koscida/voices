const express = require("express");
const actorController = require("../controllers/actorController");

const router = express.Router();

// router.get("/actor", actorController.actorView);
// router.post("/actor", actorController.actorCreate);

router
	.route("/actor")
	.get(actorController.actorView)
	.post(actorController.actorCreate);

router.route("/actor/:id").get(actorController.actorViewById);

module.exports = router;
