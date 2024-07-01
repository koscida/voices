const { Actor, Character, ActorToCharacter } = require("../models/models");
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

	// ////
	// functions

	// actors with character
	getCharacters: async (req, res) => {
		const { actorId } = req.params;
		console.log("actorId: ", actorId);

		// get actor
		const actor = await Actor.findOne({
			where: { id: actorId },
		});
		// error if does not exist
		if (!actor) {
			jsonErrorDoesNotExist(res, actorId);
			return;
		}

		// get characters
		const data = await Character.findAll({
			include: [
				{
					model: ActorToCharacter,
					where: { ActorId: actorId },
				},
			],
			order: [["characterName", "ASC"]],
		});

		// return
		data
			? jsonSuccess(res, data)
			: jsonError(res, `Error in getCharacters ${actorId}`);
		return;
	},
};
