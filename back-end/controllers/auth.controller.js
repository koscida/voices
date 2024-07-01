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
			["ac.txt"].forEach(async (fileName) => {
				console.log("------\nfileName: ", fileName);

				// create promise to read the file
				const filePromise = new Promise(async (resolve, reject) => {
					await readMediaFile(fileName, resolve, reject);
				});
				filePromise.then(
					(result) => {
						// result: {mediaName, data: {characterName: [{actorInfo}]}}
						console.log("result: ", result);

						// create promise to create the new media and characters
						const mediaCharactersPromise = new Promise(
							async (resolve, reject) => {
								await processFileMediaAndCharacters(
									result,
									resolve,
									reject
								);
							}
						);
						mediaCharactersPromise.then(
							(result) => {
								// result: {mediaName, data, characterIds}
								console.log("result: ", result);

								// create promise to create new actors
								const actorsPromise = new Promise(
									async (resolve, reject) => {
										await processFileActors(
											result,
											resolve,
											reject
										);
									}
								);
								actorsPromise.then(
									(result) => {
										// result: done
										console.log("result: ", result);

										// complete
									},
									(err) => {
										console.log(err);
										return;
									}
								);
							},
							(err) => {
								console.log(err);
								return;
							}
						);
					},
					(err) => {
						console.log(err);
						return;
					}
				);

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
			const episodesTotal = episodeYears[0] ?? 0;
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

// process the lines
const processFileMediaAndCharacters = async (result, resolve, reject) => {
	const { mediaName, data } = result;
	let isError = false;

	// create media
	const media = await getOrCreateMedia(mediaName);
	if (!media) isError = true;
	const mediaId = media.id;

	// create characters
	let characterIds = {};
	Object.entries(data).forEach(async ([characterName, actors]) => {
		if (!isError) {
			const character = await getOrCreateCharacter(
				characterName,
				mediaId
			);
			const characterId = character.id;
			characterIds[characterName] = characterId;
		}
	});

	// return
	isError
		? reject("error creating media and characters")
		: resolve({ ...result, characterIds });
};
// process the lines
const processFileActors = async (result, resolve, reject) => {
	const { data, characterIds } = result;
	let isError = false;

	// create characters
	Object.entries(data).forEach(async ([characterName, actors]) => {
		if (!isError) {
			// get character
			const characterId = characterIds[characterName];
			if (characterId)
				actors.forEach(async (actorInfo) => {
					// create actor
					const actor = await getOrCreateActor(actorInfo.actorName);
					const actorId = actor.id;

					// create relationship
					const actorCharacter = await getOrCreateActorCharacter(
						actorId,
						characterId
					);
				});
		}
	});

	// return
	isError ? reject("error creating actors") : resolve("created");
};

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
