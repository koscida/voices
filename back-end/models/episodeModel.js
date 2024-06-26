// const episodesModel = {
// 	name: "Actor Name",
// 	season: 1,
// 	episode: 1,

// 	characters: [],
// };

const { DataTypes } = require("sequelize");
const { sequelize } = require("../server/db");

const Episode = sequelize.define("episodes", {
	id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		primaryKey: true,
	},
	mediaId: {
		type: DataTypes.INTEGER,
	},
	name: {
		type: DataTypes.STRING,
	},
	year: {
		type: DataTypes.INTEGER,
	},
	season: {
		type: DataTypes.INTEGER,
	},
});

module.exports = Episode;
