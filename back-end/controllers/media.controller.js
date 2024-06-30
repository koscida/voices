const {
	Media,
	Character,
	ActorToCharacter,
	Actor,
} = require("../models/models");
const { QueryTypes } = require("sequelize");
const {
	jsonSuccess,
	jsonCreated,
	jsonUpdated,
	jsonError,
	jsonErrorDup,
	jsonErrorDoesNotExist,
} = require("./functions");
const baseController = require("./base.controller");
const { sequelize } = require("../server/db");

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
	getActors: async (req, res) => {
		const { mediaId } = req.params;
		console.log("mediaId: ", mediaId);

		const characters = await Character.findAll({
			where: { mediaId },
			order: [["characterName", "ASC"]],
		});
		console.log("characters: ", characters);

		if (characters) {
			// const charactersWithActors = characters.reduce(
			// 	async (cwa, character) => {
			// 		const characterActors = await ActorToCharacter.findAll({
			// 			where: { characterId: character.id },
			// 		});

			// 		const actors = characterActors.reduce(
			// 			async (actors, characterActor) => [
			// 				...actors,
			// 				await Actor.findAll({
			// 					where: { id: characterActor.actorId },
			// 				}),
			// 			],
			// 			[]
			// 		);

			// 		return [...cwa, { ...character, actors }];
			// 	},
			// 	[]
			// );
			const charactersWithActors = [];

			charactersWithActors
				? jsonSuccess(res, { characters, charactersWithActors })
				: jsonError(res, `Error in getActors ${mediaId}`);
			return;
		} else {
			jsonError(res, `Error in getActors ${mediaId}`);
			return;
		}

		//

		// const q = "SELECT * FROM media";
		// // +
		// // 		" LEFT JOIN `characters` AS c ON `m`.`id` = `c`.`mediaId` " +
		// // 		" LEFT JOIN `actorToCharacters` ON `c`.`id` = `actorToCharacters`.`characterId` " +
		// // 		" LEFT JOIN `actors` AS a ON `actorToCharacters`.`actorId` = `a`.`id` "
		// const data = await sequelize.query(q, {
		// 	type: QueryTypes.SELECT,
		// });

		// // return
		// data
		// 	? jsonSuccess(res, data)
		// 	: jsonError(res, `Error in getActors ${mediaId}`);
		// return;

		//

		// // get media
		// const media = await Media.findOne({ where: { id: mediaId } });
		// // if does not exist, error
		// if (!media) {
		// 	jsonErrorDoesNotExist(mediaId);
		// 	return;
		// }

		// // get characters
		// const characters = Character.findAll({ where: { mediaId } });
		// // if does not exist, error
		// if (!characters) {
		// 	jsonErrorDoesNotExist(mediaId);
		// 	return;
		// }

		// // add to data
		// const data = { ...media, characters };

		// // return
		// jsonSuccess(res, data);
		// return;

		//

		// const getChars = async (characters) =>
		// 	characters.map(async (character) => {
		// 		// get actor mapping
		// 		const actors = await ActorToCharacter.findAll({
		// 			where: { characterId: character.id },
		// 		});

		// 		// get actors
		// 		actors.map(async (characterActor) => {
		// 			const actor = await Actor.findOne({
		// 				where: { id: characterActor.id },
		// 			});

		// 			// TODO
		// 			const otherMedia = [];

		// 			return { ...actor, otherMedia };
		// 		});

		// 		return { ...character, actors };
		// 	});

		// data = { ...data, characters: await getChars(characters) };
		// // process each character
		// await characters.map(async (character) => {
		// 	// get actor mapping
		// 	const actors = await ActorToCharacter.findAll({
		// 		where: { characterId: character.id },
		// 	});

		// 	// // get actors
		// 	// actors.map(async (characterActor) => {
		// 	// 	const actor = await Actor.findOne({
		// 	// 		where: { id: characterActor.id },
		// 	// 	});

		// 	// 	// TODO
		// 	// 	const otherMedia = [];

		// 	// 	return { ...actor, otherMedia };
		// 	// });

		// 	return { ...character, actors };
		// });
		// // add to data
		// data = { ...data, characters };

		// // return
		// data ? jsonSuccess(res, data) : jsonError(res, "Error in actorHistory");
		// return;
	},
};
