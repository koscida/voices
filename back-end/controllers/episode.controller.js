// const Episode = require("../models/episode.model");
// const {
// 	jsonSuccess,
// 	jsonCreated,
// 	jsonUpdated,
// 	jsonError,
// 	jsonErrorDup,
// 	jsonErrorDoesNotExist,
// } = require("./functions");
// const baseController = require("./base.controller");
// const Media = require("../models/media.model");

// const parentKey = "mediaId";

// module.exports = {
// 	// post
// 	post: async (req, res) => {
// 		await baseController.postWithParent(
// 			Episode,
// 			Media,
// 			parentKey,
// 			req,
// 			res
// 		);
// 	},

// 	// get
// 	get: async (req, res) => {
// 		await baseController.getWithParent(Episode, Media, parentKey, req, res);
// 	},

// 	// put
// 	put: async (req, res) => {
// 		await baseController.put(Episode, req, res);
// 	},

// 	// delete
// 	delete: async (req, res) => {
// 		await baseController.delete(Episode, req, res);
// 	},
// };
