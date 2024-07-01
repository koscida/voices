const { Character, Actor, ActorToCharacter } = require("../models/models");
const {
	jsonSuccess,
	jsonCreated,
	jsonUpdated,
	jsonError,
	jsonErrorDup,
	jsonErrorDoesNotExist,
} = require("./functions");
const baseController = require("./base.controller");

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

	// ////
	// functions

	// actors with character
	getActors: async (req, res) => {
		const { characterId } = req.params;
		console.log("characterId: ", characterId);

		// get character
		const character = await Character.findOne({
			where: { id: characterId },
		});
		// error if does not exist
		if (!character) {
			jsonErrorDoesNotExist(res, characterId);
			return;
		}

		// get actors
		const data = await Actor.findAll({
			include: [
				{
					model: ActorToCharacter,
					where: { CharacterId: characterId },
				},
			],
			order: [["actorName", "ASC"]],
		});

		// return
		data
			? jsonSuccess(res, data)
			: jsonError(res, `Error in getActors ${characterId}`);
		return;
	},

	// media with character
	getMedia: async (req, res) => {
		const { characterId } = req.params;
		console.log("characterId: ", characterId);

		// get character
		const character = await Character.findOne({
			where: { id: characterId },
		});
		// error if does not exist
		if (!character) {
			jsonErrorDoesNotExist(res, characterId);
			return;
		}

		// get media
		const data = await Media.findOne({
			where: { characterId },
			order: [["actorName", "ASC"]],
		});

		// return
		data
			? jsonSuccess(res, data)
			: jsonError(res, `Error in getActors ${characterId}`);
		return;
	},
};
