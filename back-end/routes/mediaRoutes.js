const express = require("express");
const mediaController = require("../controllers/mediaController");
const baseRoutes = require("./baseRoutes");

// media endpoint
const endpoint = "/media";

module.exports = {
	addRoutes: (router) => {
		baseRoutes.addCRUDRoutes(router, endpoint, mediaController);
		baseRoutes.addCRUDRoutesId(router, endpoint, mediaController);
	},
};
