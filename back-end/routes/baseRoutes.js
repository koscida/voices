const express = require("express");

module.exports = {
	addCRUDRoutes: (router, endpoint, controller) =>
		router
			.route(endpoint)
			.post(controller.post)
			.get(controller.get)
			.put(controller.put)
			.delete(controller.delete),
	addCRUDRoutesId: (router, endpoint, controller) =>
		router
			.route(`${endpoint}/:id`)
			.get(controller.get)
			.put(controller.put)
			.delete(controller.delete),
};
