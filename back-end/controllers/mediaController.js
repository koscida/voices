const Media = require("../models/mediaModel");
const {
	jsonSuccess,
	jsonCreated,
	jsonUpdated,
	jsonError,
	jsonErrorDup,
	jsonErrorDoesNotExist,
} = require("./functions");
const baseController = require("./baseController");

// ////
// Functions

// get single with history
const getActorHistory = async (req, res) => {
	const { name, history } = req.body;
	let data = {};

	// Get media
	const media = await Media.findOne({ where: { name } });
	if (!media) {
		jsonError(res, `Error: media with name ${name} does not exist`);
		return;
	}
	data.media = media;

	// Get characters

	// Get actors

	// Get actors other media

	// Build data
	//const data = { ...media, characters };

	jsonSuccess(res, data);
};

// ////
// Endpoints

module.exports = {
	// post
	post: async (req, res) => {
		baseController.post(Media, req, res);
	},

	// get
	get: async (req, res) => {
		baseController.get(Media, req, res);
	},

	// put
	put: async (req, res) => {
		baseController.put(Media, req, res);
	},

	// delete
	delete: async (req, res) => {
		baseController.delete(Media, req, res);
	},

	// functions

	// mediaActorHistory
	mediaActorHistory: async (req, res) => {},
};
