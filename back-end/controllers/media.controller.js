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
		baseController.post(Media, "mediaName", req, res);
	},

	// get
	get: async (req, res) => {
		baseController.get(Media, "mediaName", req, res);
	},

	// put
	put: async (req, res) => {
		baseController.put(Media, "mediaName", req, res);
	},

	// delete
	delete: async (req, res) => {
		baseController.delete(Media, "mediaName", req, res);
	},

	// functions

	// characters with media
	getCharacters: async (req, res) => {
		const { mediaId } = req.params;
		console.log("mediaId: ", mediaId);

		// get media
		const media = await Media.findOne({
			where: { id: mediaId },
		});
		// error if does not exist
		if (!media) {
			jsonErrorDoesNotExist(res, mediaId);
			return;
		}

		// get characters
		const data = await Character.findAll({
			where: { mediaId },
			order: [["characterName", "ASC"]],
		});

		// return
		data
			? jsonSuccess(res, data)
			: jsonError(res, `Error in getActors ${mediaId}`);
		return;
	},

	// mediaActorHistory
	getCharactersActors: async (req, res) => {
		const { mediaId } = req.params;
		console.log("mediaId: ", mediaId);

		// ////
		// create promises
		const filePromise = new Promise(async (resolve, reject) => {
			// get media
			const media = await Media.findOne({
				where: { id: mediaId },
				returning: true,
			});

			// return
			media
				? resolve({ media: media.dataValues })
				: reject("does not exist");
		});
		filePromise
			.then(
				(result) => {
					// get characters
					return new Promise(async (resolve, reject) => {
						const mediaId = result.media.id;

						const characters = await Character.findAll({
							where: { mediaId },
							order: [["characterName", "ASC"]],
							include: [
								{
									model: Actor,
									include: [
										{
											model: Character,
										},
									],
								},
							],
							returning: true,
						});

						if (characters) {
							const c = characters.reduce(
								(red, c) => ({
									...red,
									[c.characterName]: c.dataValues,
								}),
								{}
							);

							resolve({ ...result, characters: c });
						} else {
							reject("cannot find characters");
						}
					});
				},
				(error) => {
					console.log(error);
					jsonErrorDoesNotExist(res, mediaId);
				}
			)
			.then(
				(result) => {
					console.log("---result: ", result);

					// get all medias from actors other characters
					return new Promise(async (resolve, reject) => {
						const { characters, media } = result;
						let charactersObj = Object.entries(characters);

						const transaction = await sequelize.transaction();

						try {
							const characterActorMediaList = {};

							for (var i = 0; i < charactersObj.length; i++) {
								const characterName = charactersObj[i][0];
								const character = charactersObj[i][1];
								const actors = character.Actors;

								for (var j = 0; j < actors.length; j++) {
									const actor = actors[j];
									const { actorName, Characters } = actor;

									for (
										var k = 0;
										k < Characters.length;
										k++
									) {
										const char = Characters[k];
										const medId = char.mediaId;

										// if media not already in list
										if (!characterActorMediaList[medId]) {
											characterActorMediaList[medId] =
												await Media.findOne({
													where: { id: medId },
													returning: true,
												});
										}
									}
								}
							}

							await transaction.commit();
							resolve({ ...result, characterActorMediaList });
						} catch (error) {
							await transaction.rollback();
							reject("error getting actor-character data");
							console.error(
								"Error during bulk actor's characters find:",
								error
							);
						}
					});
				},
				(error) => {
					// console.log(error);
					jsonError(error);
				}
			)
			.then(
				(result) => {
					// console.log("----result: ", result);
					jsonSuccess(res, result);
				},
				() => {}
			);

		// ////

		// get media

		// // get characters and actors
		// const data = await Character.findAll({
		// 	where: { mediaId },
		// 	order: [["characterName", "ASC"]],

		// 	include: [
		// 		{
		// 			model: ActorToCharacter,
		// 			include: [
		// 				{
		// 					model: Actor,
		// 					include: [
		// 						{
		// 							model: ActorToCharacter,
		// 							include: [
		// 								{
		// 									model: Character,
		// 								},
		// 							],
		// 						},
		// 					],
		// 				},
		// 			],
		// 		},
		// 	],
		// });

		// // return
		// data
		// 	? jsonSuccess(res, data)
		// 	: jsonError(res, `Error in getActors ${mediaId}`);
		// return;
	},
};
