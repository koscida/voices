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
	name: {
		type: DataTypes.STRING,
	},
	season: {
		type: DataTypes.INTEGER,
	},
	episode: {
		type: DataTypes.INTEGER,
	},
});

module.exports = Episode;
