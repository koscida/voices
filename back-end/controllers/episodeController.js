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
	// post
	post: async (req, res) => {
		const { mediaId } = req.params;
		const { name } = req.body;

		// get parent
		const parent = await Media.findOne({ where: { id: mediaId } });

		// if does NOT exist, error
		if (!parent) {
			jsonErrorDoesNotExist(res, mediaId);
			return;
		}

		// get child
		const single = await Episode.findOne({ where: { name, mediaId } });

		// if exists, error
		if (single) {
			jsonErrorDup(res, name);
			return;
		}

		// create child
		const newEpisode = { ...req.body, mediaId };
		const data = await Episode.create(newEpisode);

		// return
		data
			? jsonCreated(res, data)
			: jsonError(res, `Error: creating ${name}`);
		return;
	},

	// get
	get: async (req, res) => {
		baseController.get(Episode, req, res);
	},

	// put
	put: async (req, res) => {
		baseController.put(Episode, req, res);
	},

	// delete
	delete: async (req, res) => {
		baseController.delete(Episode, req, res);
	},
};
