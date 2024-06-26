const Actor = require("../models/actorModel");
const {
	jsonSuccess,
	jsonCreated,
	jsonUpdated,
	jsonError,
	jsonErrorDup,
	jsonErrorDoesNotExist,
} = require("./functions");
const baseController = require("./baseController");

module.exports = {
	// post
	post: async (req, res) => {
		baseController.post(Actor, req, res);
	},

	// get
	get: async (req, res) => {
		baseController.get(Actor, req, res);
	},

	// put
	put: async (req, res) => {
		baseController.put(Actor, req, res);
	},

	// delete
	delete: async (req, res) => {
		baseController.delete(Actor, req, res);
	},
};
