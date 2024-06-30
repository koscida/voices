const express = require("express");
const authController = require("../controllers/auth.controller");

module.exports = {
	addRoutes: (router) => {
		router.get("/", authController.homeView);
		router.get("/api", authController.homeView);

		router.get("/nuke", authController.nukeView);
		router.get("/clear", authController.clearView);
		router.get("/run", authController.runView);
	},
};
