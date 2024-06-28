const express = require("express");
const actorHistoryController = require("../controllers/actorHistoryController");
const baseRoutes = require("./baseRoutes");

// episode endpoint
const endpoint = "/media/:mediaId/actorHistory";

module.exports = {
	addRoutes: (router) => {
		router.route(endpoint).get(actorHistoryController.get);
	},
};
