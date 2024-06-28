const express = require("express");
const actorController = require("../controllers/actorController");
const baseRoutes = require("./baseRoutes");

// actor endpoint
const endpoint = "/actor";

module.exports = {
	addRoutes: (router) => {
		baseRoutes.addCRUDRoutes(router, endpoint, actorController);
		baseRoutes.addCRUDRoutesId(router, endpoint, actorController);
	},
};
