const Media = require("../models/mediaModel");
const Actor = require("../models/actorModel");
const Character = require("../models/characterModel");

module.exports = {
	homeView: async (req, res) => {
		res.json({ message: "Hello from server!" });
	},
	runView: async (req, res) => {
		const fs = require("node:fs");

		// Create media
		await Actor.create({ name: "My Hero Academia" });

		// Read media file
		fs.readFile("../back-end/data/mha.txt", "utf8", (err, data) => {
			// check for file error
			if (err) {
				console.error(err);
				return;
			}

			// split each new line
			const splitByLine = data.split("\r\n");
			let lines = [];
			for (let i = 0; i < splitByLine.length; i++) {
				// pair lines up
				if (i % 2 === 0) {
					// split by tab
					lines.push([
						...splitByLine[i].split("\t").map((l) => l.trim()),
						...splitByLine[i + 1].split("\t").map((l) => l.trim()),
					]);
				}
			}
			// lines contains array of arrays, inner array is: name (from pic), name, ..., character, episodes

			// add to db
			lines.map(async (line) => {
				await Actor.create({ name: line[1] });
				await Character.create({ name: line[3] });
			});
		});

		res.json({ message: "Done!" });
		return;
	},
};
