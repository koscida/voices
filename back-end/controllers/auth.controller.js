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
			// files = ["ac_copy.txt"];
			files.forEach((fileName) => {
				console.log("------\nfileName: ", fileName);

				// ////
				// create promises
				const filePromise = new Promise(async (resolve, reject) => {
					// read media file
					await readMediaFile(fileName, resolve, reject);
				});
				filePromise
					.then((result) => {
						// create media
						return new Promise(async (resolve, reject) => {
							await processMedia(result, resolve, reject);
						});
					}, promiseErr)
					.then((result) => {
						// create characters
						return new Promise(async (resolve, reject) => {
							await processCharacters(result, resolve, reject);
						});
					})
					.then((result) => {
						// get characters data
						return new Promise(async (resolve, reject) => {
							await getCharacterData(result, resolve, reject);
						});
					})
					.then((result) => {
						// create actors
						return new Promise(async (resolve, reject) => {
							await processActors(result, resolve, reject);
						});
					})
					.then((result) => {
						// get actor data
						return new Promise(async (resolve, reject) => {
							await getActorData(result, resolve, reject);
						});
					})
					.then((result) => {
						// create character to actor connection
						return new Promise(async (resolve, reject) => {
							await processActorsToCharacters(
								result,
								resolve,
								reject
							);
						});
					})
					.then((result) => {
						console.log("complete");

						return {};
					});
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
					else {
						const characterActors = data[characterName];
						// if actor not in character list
						if (
							characterActors.filter(
								(c) => c.actorName === actorName
							).length === 0
						) {
							data[characterName] = [
								...data[characterName],
								actorInfo,
							];
						}
					}
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
const processMedia = async (result, resolve, reject) => {
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
const processCharacters = async (result, resolve, reject) => {
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

			// return results
			// resolve({
			// 	...result,
			// 	charactersResult,
			// });
			resolve(result);
		})
		.catch((err) => {
			console.error("Failed to insert characters", err);
			reject("error creating characters");
		});
};
// get the character ids
const getCharacterData = async (result, resolve, reject) => {
	const { data, mediaId } = result;
	const characterNames = Object.keys(data);
	const transaction = await sequelize.transaction();

	try {
		const characterData = {};
		for (var i = 0; i < characterNames.length; i++) {
			const characterName = characterNames[i];
			characterData[characterName] = await Character.findOne({
				where: { characterName, mediaId },
			});
		}

		await transaction.commit();
		resolve({ ...result, characterData });
	} catch (error) {
		await transaction.rollback();
		reject("error getting character data");
		console.error("Error during bulk character find:", error);
	}
};

// process the actors
const processActors = async (result, resolve, reject) => {
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
			// resolve({ ...result, actorResults });
			resolve(result);
		})
		.catch((err) => {
			console.error("Failed to insert actors", err);
			reject("error creating actors");
		});
};
// get the actor ids
const getActorData = async (result, resolve, reject) => {
	const { data, mediaId } = result;
	const transaction = await sequelize.transaction();
	const dataObj = Object.entries(data);

	try {
		const actorData = {};

		for (var i = 0; i < dataObj.length; i++) {
			const characterName = dataObj[i][0];
			const characterActors = dataObj[i][1];
			for (var j = 0; j < characterActors.length; j++) {
				const { actorName } = characterActors[j];

				actorData[actorName] = await Actor.findOne({
					where: { actorName },
				});
			}
		}

		await transaction.commit();
		resolve({ ...result, actorData });
	} catch (error) {
		await transaction.rollback();
		reject("error getting actor data");
		console.error("Error during bulk actor find:", error);
	}
};

// process the actorsToCharacters
const processActorsToCharacters = async (result, resolve, reject) => {
	const { data, characterData, actorData } = result;

	// customer.addProducts(product)

	Object.entries(data).forEach(([characterName, characterActors]) => {
		const character = characterData[characterName];
		characterActors.forEach(({ actorName }) => {
			const actor = actorData[actorName];

			// console.log("character: ", character, "\nactor: ", actor);

			// add here
			character.addActor(actor);

			//sql: "INSERT INTO `ActorToCharacters` (`id`,`createdAt`,`updatedAt`,`CharacterId`,`ActorId`)
			//	VALUES (NULL,'2024-07-06 17:48:11.363 +00:00','2024-07-06 17:48:11.363 +00:00',1,3);"
		});
	});

	// //

	// cannot bulk insert:

	// // create actor-to-character inserts
	// const actorToCharacterInserts = [];
	// Object.entries(data).forEach(([characterName, actors]) => {
	// 	actors.forEach((actor) =>
	// 		actorToCharacterInserts.push({
	// 			ActorId: actorIds[actor.actorName],
	// 			CharacterId: characterIds[characterName],
	// 		})
	// 	);
	// });

	// // bulk insert...relationships
	// await ActorToCharacter.bulkCreate(actorToCharacterInserts, {
	// 	ignoreDuplicates: true,
	// })
	// 	.then((actorToCharacterResults) => {
	// 		console.log("ActorsToCharacters have been inserted");

	// 		resolve({ ...result, actorIds, actorToCharacterResults });
	// 	})
	// 	.catch((err) => {
	// 		console.error("Failed to insert actors", err);
	// 		reject("error creating media and actors");
	// 	});
	resolve(result);
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
				const actor = await Actor.create(
					{
						actorName,
						character: [
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
				console.log("add actor: ", actor);
				return actor;
			});

			const charactersResult = await Character.create(
				{
					characterName,
					mediaId,
					characterPosterUrl,
					characterPosterAlt,
					key: getKey(mediaId, characterName),
					Actor: actors.map(({ actorName }) => {
						actorName;
					}),
				},
				{
					ignoreDuplicates: true,
					returning: true,
				}
			);
			console.log("add character: ", charactersResult);
			// const charactersResult = {};

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
