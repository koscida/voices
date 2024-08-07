const express = require("express");
const loadController = require("../controllers/load.controller");

module.exports = {
	addRoutes: (router) => {
		router.get("/load", loadController.loadAll);
	},
	addRoutes: (router) => {
		router.get("/load/:fileName", loadController.loadOne);
	},
};
