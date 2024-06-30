const express = require("express");
const characterController = require("../controllers/character.controller");
const baseRoutes = require("./base.routes");

// actor endpoint
const endpoint = "/character";

module.exports = {
	addRoutes: (router) => {
		baseRoutes.addCRUDRoutes(router, endpoint, characterController);
		baseRoutes.addCRUDRoutesId(router, endpoint, characterController);
	},
};
