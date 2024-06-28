const Media = require("../models/mediaModel");
const Episode = require("../models/episodeModel");
const Character = require("../models/characterModel");
const EpisodeToCharacters = require("../models/episodesToCharactersModel");
const Actor = require("../models/actorModel");
const ActorToCharacter = require("../models/actorToCharactersModel");
const { sequelize } = require("../server/db");

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
		await Episode.truncate();
		await Character.truncate();
		await EpisodeToCharacters.truncate();
		await Actor.truncate();
		await ActorToCharacter.truncate();
	},
	runView: async (req, res) => {
		const fs = require("node:fs");

		// list of media files
		const fileRootPath = "./data/";
		fs.readdir(fileRootPath, (err, files) => {
			// check for file error
			if (err) {
				console.error(err);
				return;
			}

			// get all files
			files.forEach((fileName) => {
				console.log("------\nFile: ", fileName);

				// Read media file
				fs.readFile(`data/${fileName}`, "utf8", async (err, data) => {
					// check for file error
					if (err) {
						console.error(err);
						return;
					}

					// split data by each new line
					let dataByLine = data.split("\r\n");

					// first line will be name
					const name = dataByLine.shift();
					// Create media, each media will be new
					const media = await Media.create({ name });

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
								...dataByLine[i]
									.split("\t")
									.map((l) => l.trim()),
								...dataByLine[i + 1]
									.split("\t")
									.map((l) => l.trim()),
							]);
						}
					}
					/*
					lines contains array of arrays, inner array is data from txt files:
						0. name (from pic),
						1. name,
						2. ...,
						3. character,
						4. episodes
						*/

					// process lines, add each to db
					lines.map(async (line) => {
						const actorName = line[1],
							characterName = line[3],
							totalEpisodes = line[4] ?? 0;

						// check if character exists
						let character = await Character.findOne({
							where: { name: characterName, mediaId: media.id },
						});
						// if does not exist, create the character
						if (!actor) {
							character = await Character.create({
								name: characterName,
								mediaId: media.id,
							});
						}

						// TODO: episodes, still need to get data

						// check if actor exists
						let actor = await Actor.findOne({
							where: { name: actorName },
						});
						// if does not exist, create one
						if (!actor) {
							actor = await Actor.create({ name: actorName });
						}

						// add actor-character connection
						const actorToCharacter = await ActorToCharacter.create({
							actorId: actor.id,
							characterId: character.id,
							totalEpisodes,
						});
					});
				});
			});
		});

		res.json({ message: "Done!" });
		return;
	},
};
