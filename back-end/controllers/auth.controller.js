const { rejects } = require("node:assert");
const {
	Media,
	Character,
	Actor,
	ActorToCharacter,
} = require("../models/models");
const { sequelize } = require("../server/db");
const fs = require("node:fs");

module.exports = {
	homeView: async (req, res) => {
		res.json({ message: "Hello from server!" });
	},

	nukeView: async (req, res) => {
		await sequelize.drop();

		res.json({ message: "Done!" });
		return;
	},

	clearView: async (req, res) => {
		// clear data in db
		await Media.truncate();
		// await Episode.truncate();
		await Character.truncate();
		// await EpisodeToCharacters.truncate();
		await Actor.truncate();
		await ActorToCharacter.truncate();

		// sync
		sequelize
			.sync({ force: true })
			.then(() => {
				console.info("Model synchronization completed");
			})
			.catch((error) => {
				console.error("Unable to create table : ", error);
			});

		res.json({ message: "Done!" });
		return;
	},

	runView: async (req, res) => {
		let isError = false;

		// list of media files
		const fileRootPath = "./data/";
		fs.readdir(fileRootPath, (err, files) => {
			// check for file error
			if (err) {
				console.log(err);
				isError = true;
				return;
			}

			// get all files
			//files.forEach((fileName) => {
			["ac_copy.txt"].forEach(async (fileName) => {
				console.log("------\nfileName: ", fileName);

				// ////
				// create file promises
				const filePromise = new Promise(async (resolve, reject) => {
					await readMediaFile(fileName, resolve, reject);
				});
				const filePromiseResolve = (filePromiseResult) => {
					//console.log("result of filePromise: ", filePromiseResult);

					// ////
					// create media promises
					const fileMediaPromise = new Promise(
						async (resolve, reject) => {
							await processFileMedia(
								filePromiseResult,
								resolve,
								reject
							);
						}
					);
					const fileMediaPromiseResolve = (
						fileMediaPromiseResult
					) => {
						console.log(
							"result of fileMediaPromise: ",
							fileMediaPromiseResult
						);
						console.log(
							"fileMediaPromiseResult.data[0]: ",
							fileMediaPromiseResult.data["Koro-sensei"]
						);

						// ////
						// create character promises
						const fileCharactersPromise = new Promise(
							async (resolve, reject) => {
								// await processFileCharacters(
								// 	fileMediaPromiseResult,
								// 	resolve,
								// 	reject
								// );
								await processFileCharactersETC(
									fileMediaPromiseResult,
									resolve,
									reject
								);
							}
						);
						const fileCharactersPromiseResolve = (
							fileCharactersPromiseResult
						) => {
							console.log(
								"result of fileCharactersPromise: ",
								fileCharactersPromiseResult
							);

							// // ////
							// // create actor promises
							// const fileActorsPromise = new Promise(
							// 	async (resolve, reject) => {
							// 		await processFileActors(
							// 			fileCharactersIdsPromiseResult,
							// 			resolve,
							// 			reject
							// 		);
							// 	}
							// );
							// fileActorsPromise.then(
							// 	fileActorsPromiseResolve,
							// 	(err) => {
							// 		console.log(err);
							// 		return;
							// 	}
							// );
							// const fileActorsPromiseResolve = (
							// 	fileActorsPromiseResult
							// ) => {
							// 	// ////
							// 	// create actor to character promise
							// 	const fileActorsToCharactersPromise =
							// 		new Promise(async (resolve, reject) => {
							// 			await processFileActorsToCharacters(
							// 				fileActorsPromiseResult,
							// 				resolve,
							// 				reject
							// 			);
							// 		});
							// 	fileActorsToCharactersPromise.then(
							// 		fileActorsToCharactersPromiseResolve,
							// 		promiseErr
							// 	);
							// 	const fileActorsToCharactersPromiseResolve =
							// 		(
							// 			fileActorsToCharactersPromiseResult
							// 		) => {
							// 			res.json({ message: "Done!" });
							// 		};
							// };
						};
						fileCharactersPromise.then(
							fileCharactersPromiseResolve,
							promiseErr
						);
					};
					fileMediaPromise.then(fileMediaPromiseResolve, promiseErr);
				};
				filePromise.then(filePromiseResolve, promiseErr);

				// process the data
				//await processFileLines(mediaName, data);
			});
		});

		isError
			? res.json({ message: "Error!" })
			: res.json({ message: "Done!" });
		return;
	},
};

const promiseErr = (err) => {
	console.log(err);
	return;
};
const getKey = (mediaId, characterName) => btoa(`${mediaId}:${characterName}`);

// read the file
const readMediaFile = async (fileName, resolve, reject) => {
	// Read media file
	fs.readFile(`data/${fileName}`, "utf8", (err, fileData) => {
		// check for file error
		if (err) {
			console.log(err);
			return;
		}

		// split data by each new line
		let dataByLine = fileData.split("\r\n");

		// first line will be name
		const mediaName = dataByLine.shift();

		// process each line
		let lines = [];
		for (let i = 0; i < dataByLine.length; i++) {
			// pair lines up
			if (
				i % 2 === 0 &&
				dataByLine.length >= i &&
				dataByLine[i] &&
				dataByLine[i + 1]
			) {
				// split by tab
				lines.push([
					...dataByLine[i].split("\t").map((l) => l.trim()),
					...dataByLine[i + 1].split("\t").map((l) => l.trim()),
				]);
			}
		}

		/*
		result contains array of arrays, inner array is data from txt files:
			0. name (from pic)
			1. names
			2. ...
			3. character separated by /
			4. episodes and year separated by ,
		*/

		// destructure data
		let data = [];
		lines.forEach((line) => {
			const actorName = line[1],
				characterNames = line[3],
				episodeYear = line[4];

			// if any data null
			if (!actorName || !characterNames || !episodeYear) return;

			// get character names
			const characters = characterNames
				.split("/")
				.map((c) => c.trim())
				.filter((c) => !c.includes("..."));

			// get episodes and year
			const episodeYears = episodeYear.split(",").map((c) => c.trim());
			const episodesTotal = episodeYears[0]
				? episodeYears[0]
						.replace(" ", "")
						.replace("episode", "")
						.replace("s", "")
				: 0;
			const years =
				episodeYears.length > 1 && episodeYears[1]
					? episodeYears[1].split("-").map((c) => c.trim())
					: 0;

			// create actor blurb
			const actorInfo = { actorName, episodesTotal, years };

			// add to data by character
			characters.forEach((characterName) => {
				if (characterName) {
					if (!data[characterName]) data[characterName] = [actorInfo];
					else
						data[characterName] = [
							...data[characterName],
							actorInfo,
						];
				}
			});
		}, {});

		// return
		if (!mediaName || !data) {
			reject("Error in reading file");
		} else {
			resolve({ mediaName, data });
		}
	});
};

// process the media
const processFileMedia = async (result, resolve, reject) => {
	const { mediaName, data } = result;

	// create media
	const media = await getOrCreateMedia(mediaName);

	// return
	if (media) {
		const mediaId = media.id;
		resolve({ ...result, mediaId });
	} else {
		console.error("Failed to insert characters");
		reject("error creating media");
	}
};
// process the characters
const processFileCharacters = async (result, resolve, reject) => {
	const { mediaId, data } = result;
	let characterPosterUrl,
		characterPosterAlt = "";

	// create actor inserts
	const characterInserts = [];
	Object.entries(data).forEach(([characterName, actors]) => {
		const key = getKey(mediaId, characterName);
		characterInserts.push({
			characterName,
			mediaId,
			key,
			characterPosterUrl,
			characterPosterAlt,
		});
	});

	// bulk insert...characters
	await Character.bulkCreate(characterInserts, {
		ignoreDuplicates: true,
		returning: true,
	})
		.then(async (charactersResult) => {
			console.log("Characters have been inserted");

			// get character ids
			const characterIds = {};

			// get character ids in promise
			const getCharacterIdsPromise = new Promise(
				async (resolveIds, rejectIds) => {
					// get character ids
					const characterIds = {};
					characterInserts.forEach(async ({ characterName }) => {
						const char = await Character.findOne({
							where: { characterName },
						});
						characterIds[characterName] = char.id;
					});

					// return results
					resolveIds({
						...result,
						charactersResult,
						characterIds,
					});
				}
			);
			const getCharacterIdsPromiseResolve = (getCharacterIdsResult) =>
				resolve(getCharacterIdsResult);
			getCharacterIdsPromise.then(
				getCharacterIdsPromiseResolve,
				promiseErr
			);

			// //

			// // return results
			// resolve({
			// 	...result,
			// 	charactersResult,
			// 	characterIds,
			// });
		})
		.catch((err) => {
			console.error("Failed to insert characters", err);
			reject("error creating characters");
		});
};
// get the character ids
const getFileCharacterIds = async (result, resolve, reject) => {
	const { data } = result;

	// get character ids
	const characterIds = {};
	Object.entries(data).forEach(async ([characterName, actors]) => {
		const character = await Character.findOne({ where: { characterName } });
		if (character) characterIds[characterName] = character.id;
	});

	characterIds
		? resolve({ ...result, characterIds })
		: reject("error getting character ids");
};
// process the actors
const processFileActors = async (result, resolve, reject) => {
	const { mediaName, data } = result;
	let actorPosterUrl,
		actorPosterAlt = "";

	// create actor inserts
	const actorInserts = [];
	Object.entries(data).forEach(([characterName, actors]) => {
		actors.forEach(({ actorName }) =>
			actorInserts.push({ actorName, actorPosterUrl, actorPosterAlt })
		);
	});

	// bulk insert...actors
	await Actor.bulkCreate(actorInserts, {
		ignoreDuplicates: true,
	})
		.then(async (actorResults) => {
			console.log("Actors have been inserted");

			// return results
			resolve({ ...result, actorResults });
		})
		.catch((err) => {
			console.error("Failed to insert actors", err);
			reject("error creating actors");
		});
};
// process the actorsToCharacters
const processFileActorsToCharacters = async (result, resolve, reject) => {
	const { data, actorIds, characterIds } = result;

	// create actor-to-character inserts
	const actorToCharacterInserts = [];
	Object.entries(data).forEach(([characterName, actors]) => {
		actors.forEach((actor) =>
			actorToCharacterInserts.push({
				ActorId: actorIds[actor.actorName],
				CharacterId: characterIds[characterName],
			})
		);
	});

	// bulk insert...relationships
	await ActorToCharacter.bulkCreate(actorToCharacterInserts, {
		ignoreDuplicates: true,
	})
		.then((actorToCharacterResults) => {
			console.log("ActorsToCharacters have been inserted");

			resolve({ ...result, actorIds, actorToCharacterResults });
		})
		.catch((err) => {
			console.error("Failed to insert actors", err);
			reject("error creating media and actors");
		});
};
// process the characters
const processFileCharactersETC = async (result, resolve, reject) => {
	const { mediaId, data } = result;
	let characterPosterUrl,
		characterPosterAlt,
		actorPosterUrl,
		actorPosterAlt = "";

	// create actor inserts
	const characters = Object.entries(data).map(
		async ([characterName, actors]) => {
			const actorsResult = actors.map(async ({ actorName }) => {
				return await Actor.create(
					{
						actorName,
						Characters: [
							{
								characterName,
								mediaId,
								key: getKey(mediaId, characterName),
							},
						],
					},
					{
						ignoreDuplicates: true,
						returning: true,
					}
				);
			});

			const charactersResult = await Character.create(
				{
					characterName,
					mediaId,
					characterPosterUrl,
					characterPosterAlt,
					key: getKey(mediaId, characterName),
					Actors: actors.map(({ actorName }) => {
						actorName;
					}),
				},
				{
					ignoreDuplicates: true,
					returning: true,
				}
			);
			return { actorsResult, charactersResult };
		}
	);

	characters
		? resolve(characters)
		: reject("error creating characters and actors");
};

//

const getOrCreateMedia = async (mediaName) => {
	// check if character exists
	let media = await Media.findOne({
		where: {
			mediaName,
		},
	});
	// if does not exist, create the character
	if (!media) {
		media = await Media.create({
			mediaName,
		});
	}

	return media;
};

const getOrCreateCharacter = async (characterName, mediaId) => {
	// check if character exists
	let character = await Character.findOne({
		where: {
			characterName,
			mediaId,
		},
	});
	// if does not exist, create the character
	if (!character) {
		character = await Character.create({
			characterName,
			mediaId,
		});
	}

	return character;
};

const getOrCreateActor = async (actorName) => {
	// check if actor exists
	let actor = await Actor.findOne({
		where: {
			actorName,
		},
	});
	// if does not exist, create one
	if (!actor) {
		actor = await Actor.create({
			actorName,
		});
	}
	return actor;
};

const getOrCreateActorCharacter = async (actorId, characterId) => {
	// check if already added actor-character
	let actorToCharacter = await ActorToCharacter.findOne({
		where: {
			ActorId: actorId,
			CharacterId: characterId,
		},
	});
	// if does not exist, create one
	if (!actorToCharacter) {
		// add actor-character connection
		actorToCharacter = await ActorToCharacter.create({
			ActorId: actorId,
			CharacterId: characterId,
		});
	}
	return actorToCharacter;
};
