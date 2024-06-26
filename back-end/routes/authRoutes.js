const express = require("express");
const authController = require("../controllers/authController");

module.exports = {
	addRoutes: (router) => {
		router.get("/", authController.homeView);
		router.get("/api", authController.homeView);

		router.get("/run", authController.runView);
	},
};
