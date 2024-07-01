const express = require("express");
const mediaController = require("../controllers/media.controller");
const baseRoutes = require("./base.routes");

// media endpoint
const endpoint = "/media";

module.exports = {
	addRoutes: (router) => {
		baseRoutes.addCRUDRoutes(router, endpoint, mediaController);
		baseRoutes.addCRUDRoutesId(router, endpoint, mediaController);

		router
			.route(`${endpoint}/:mediaId/characters`)
			.get(mediaController.getCharacters);
		router
			.route(`${endpoint}/:mediaId/actors`)
			.get(mediaController.getCharactersActors);
	},
};
