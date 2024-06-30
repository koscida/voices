const express = require("express");
const actorController = require("../controllers/actor.controller");
const baseRoutes = require("./base.routes");

// actor endpoint
const endpoint = "/actor";

module.exports = {
	addRoutes: (router) => {
		baseRoutes.addCRUDRoutes(router, endpoint, actorController);
		baseRoutes.addCRUDRoutesId(router, endpoint, actorController);
	},
};
