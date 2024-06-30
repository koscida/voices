const {
	Media,
	Character,
	Actor,
	ActorToCharacter,
} = require("../models/models");
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
		// await Episode.truncate();
		await Character.truncate();
		// await EpisodeToCharacters.truncate();
		await Actor.truncate();
		await ActorToCharacter.truncate();

		res.json({ message: "Done!" });
		return;
	},

	runView: async (req, res) => {
		const fs = require("node:fs");
		let isError = false;

		// list of media files
		const fileRootPath = "./data/";
		fs.readdir(fileRootPath, (err, files) => {
			// check for file error
			if (err) {
				console.error(err);
				isError = true;
				return;
			}

			// get all files
			["ac.txt"].forEach((fileName) => {
				if (!isError) {
					//files.forEach((fileName) => {
					console.log("------\nFile: ", fileName);

					// Read media file
					fs.readFile(
						`data/${fileName}`,
						"utf8",
						async (err, data) => {
							if (!isError) {
								// check for file error
								if (err) {
									console.error(err);
									isError = true;
									return;
								}

								// split data by each new line
								let dataByLine = data.split("\r\n");

								// ////
								// first line will be name
								const mediaName = dataByLine.shift();
								// check if exists
								if (!mediaName) {
									console.log("Error getting mediaName");
									isError = true;
									return;
								}
								// find media by name
								let media = await Media.findOne({
									where: {
										mediaName,
									},
								});
								// if does not exist, create the media
								if (!media) {
									media = await Media.create({ mediaName });
								}
								// if error creating
								if (!media) {
									console.log("Error creating media");
									isError = true;
									return;
								}
								const mediaId = media.id;

								if (!isError) {
									// process each line
									let lines = [];
									for (
										let i = 0;
										i < dataByLine.length;
										i++
									) {
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

									// ////
									// process lines, add each to db
									lines.forEach(async (line) => {
										if (!isError) {
											const actorName = line[1],
												characterName = line[3],
												totalEpisodes = line[4] ?? 0;
											//if no data
											if (
												!actorName ||
												!characterName ||
												!totalEpisodes
											) {
												console.log("Not enough data");
												isError = true;
												return;
											}

											// skip if additional voice
											if (
												characterName.includes(
													"Additional Voices"
												)
											)
												return;

											// check if character exists
											let character =
												await Character.findOne({
													where: {
														characterName,
														mediaId,
													},
												});
											// if does not exist, create the character
											if (!character) {
												character =
													await Character.create({
														characterName,
														mediaId,
													});
											}
											// if error creating
											if (!character) {
												console.log(
													"Error creating character"
												);
												isError = true;
												return;
											}
											const characterId = character.id;

											// TODO: episodes, still need to get data

											// check if actor exists
											let actor = await Actor.findOne({
												where: { actorName },
											});
											// if does not exist, create one
											if (!actor) {
												actor = await Actor.create({
													actorName,
												});
											}
											// if error creating
											if (!actor) {
												console.log(
													"Error creating actor"
												);
												isError = true;
												return;
											}
											const actorId = actor.id;

											// check if already added actor-character
											let actorToCharacter =
												await ActorToCharacter.findOne({
													where: {
														actorId,
														characterId,
													},
												});
											// if does not exist, create one
											if (!actorToCharacter) {
												// add actor-character connection
												actorToCharacter =
													await ActorToCharacter.create(
														{
															actorId,
															characterId,
														}
													);
											}
										}
									});
								}
							}
						}
					);
				}
			});
		});

		if (!isError) res.json({ message: "Done!" });
		return;
	},
};
