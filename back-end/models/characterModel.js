// const characterModel = {
// 	name: "Character Name",
// 	posterUrl: "images/640x360.png",
// 	posterAlt: "poster",
// 	media: "Movie Name",
// 	actors: [],
// };

const { DataTypes } = require("sequelize");
const { sequelize } = require("../server/db");

const Character = sequelize.define("characters", {
	id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		primaryKey: true,
	},
	name: {
		type: DataTypes.STRING,
	},
	posterUrl: {
		type: DataTypes.STRING,
	},
	posterAlt: {
		type: DataTypes.STRING,
	},

	mediaId: {
		type: DataTypes.INTEGER,
	},
	totalEpisodes: {
		type: DataTypes.INTEGER,
	},
});

module.exports = Character;
