const express = require("express");
const actorController = require("../controllers/actorController");
const { createCRUDRoutes } = require("./routerHelper");

let router = express.Router();

// crud
router = createCRUDRoutes(router, "actor", actorController);

module.exports = router;
