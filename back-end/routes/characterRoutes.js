const express = require("express");
const characterController = require("../controllers/characterController");
const baseRoutes = require("./baseRoutes");

// actor endpoint
const endpoint = "/character";

module.exports = {
	addRoutes: (router) => {
		baseRoutes.addCRUDRoutes(router, endpoint, characterController);
		baseRoutes.addCRUDRoutesId(router, endpoint, characterController);
	},
};
