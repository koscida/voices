const express = require("express");
const episodeController = require("../controllers/episodeController");
const baseRoutes = require("./baseRoutes");

// episode endpoint
const endpoint = "/media/:mediaId/episode";

module.exports = {
	addRoutes: (router) => {
		baseRoutes.addCRUDRoutes(router, endpoint, episodeController);
		baseRoutes.addCRUDRoutesId(router, endpoint, episodeController);
	},
};
