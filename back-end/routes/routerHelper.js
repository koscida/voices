const createCRUDRoutes = (router, endpoint, controller) => {
	router
		.route(`/${endpoint}`)
		.post(controller.post)
		.get(controller.get)
		.put(controller.put)
		.delete(controller.delete);
	router
		.route(`/${endpoint}/:id`)
		.get(controller.get)
		.put(controller.put)
		.delete(controller.delete);
	return router;
};
exports.createCRUDRoutes = createCRUDRoutes;
