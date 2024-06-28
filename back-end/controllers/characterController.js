const Character = require("../models/characterModel");
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
		baseController.post(Character, req, res);
	},

	// get
	get: async (req, res) => {
		baseController.get(Character, req, res);
	},

	// put
	put: async (req, res) => {
		baseController.put(Character, req, res);
	},

	// delete
	delete: async (req, res) => {
		baseController.delete(Character, req, res);
	},
};
