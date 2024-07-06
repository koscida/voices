const { rejects } = require("node:assert");
const fs = require("node:fs");

const fileRootPath = "./data/";

module.exports = {
	loadAll: async (req, res) => {
		// ////
		// create file promise
		const filePromise = new Promise(async (resolve, reject) => {
			await readMediaFiles(fileRootPath, resolve, reject);
		});
		const filePromiseResolve = (filePromiseResult) => {
			res.json({
				message: "Hello from server!",
				data: filePromiseResult,
			});
			return;
		};
		filePromise.then(filePromiseResolve, promiseErr);

		//res.json({ message: "Hello from server!" });
		return;
	},
	loadOne: async (req, res) => {
		const { fileName } = req.params;
		console.log("fileName: ", fileName);
	},
};

// common promise error
const promiseErr = (err) => {
	console.log(err);
	return;
};

// read all files
const readMediaFiles = async (fileRootPath, resolve, reject) => {
	// mega data?
	const data = {};

	fs.readdir(fileRootPath, (err, files) => {
		// check for file error
		if (err) {
			console.log(err);
			isError = true;
			return;
		}

		// build data
		const media = {};
		const characters = {};
		const actors = {};

		// get all files
		files = ["ac_copy.txt"];
		files.forEach(async (fileName) => {
			console.log("------\nfileName: ", fileName);

			const filePromiseResult = await readMediaFile(fileName);
			console.log("filePromiseResult: ", filePromiseResult);

			// const mediaName = filePromiseResult.mediaName;

			// media[mediaName] = { name: mediaName };
			// console.log("media: ", media);

			//

			// // ////
			// // create file promise
			// const filePromise = new Promise(async (resolve, reject) => {
			// 	await readMediaFile(fileName, resolve, reject);
			// });
			// const filePromiseResolve = (filePromiseResult) => {
			// 	console.log(
			// 		"result of filePromise: ",
			// 		filePromiseResult,
			// 		filePromiseResult.data["Koro-sensei"]
			// 	);
			// 	/*
			// 	result of filePromise:  {
			// 		mediaName: 'Assassination Classroom',
			// 		data: [
			// 			'Koro-sensei': [ {
			// 				actorName: 'Jun Fukuyama',
			// 				episodesTotal: '47 episodes',
			// 				years: [ '2015', '2016' ]
			// 			} ],
			// 			'Nagisa Shiota': [ [Object] ],
			// 			'Additional Voices': [ [Object] ]
			// 		]
			// 	}
			// 	*/

			// 	const mediaName = filePromiseResult.mediaName;

			// 	media[mediaName] = { name: mediaName };
			// 	console.log("media: ", media);
			// };
			// filePromise.then(filePromiseResolve, promiseErr);
		});

		// build data
		data.media = media;
		data.characters = characters;
		data.actors = actors;
		console.log("data: ", data);
	});

	console.log("resolve data: ", data);
	resolve(data);
};
// read the file
const readMediaFile = async (fileName) => {
	console.log("fileName: ", fileName);
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
			// reject("Error in reading file");
			console.log("Error in reading file");
			return;
		} else {
			const result = { mediaName, data };
			console.log("result: ", result);
			return result;
		}
	});
};
