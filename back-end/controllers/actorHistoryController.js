const Episode = require("../models/episodeModel");
const {
	jsonSuccess,
	jsonCreated,
	jsonUpdated,
	jsonError,
	jsonErrorDup,
	jsonErrorDoesNotExist,
} = require("./functions");
const baseController = require("./baseController");
const Media = require("../models/mediaModel");

module.exports = {
	// get
	get: async (req, res) => {
		baseController.get(Episode, req, res);
	},
};
