// const episodeToCharactersModel = {
// 	episodeId: 1,
//	characterId: 1,
// };

const { DataTypes } = require("sequelize");
const { sequelize } = require("../server/db");

const EpisodeToCharacter = sequelize.define("episodesToCharacters", {
	id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		primaryKey: true,
	},
	episodeId: {
		type: DataTypes.INTEGER,
	},
	characterId: {
		type: DataTypes.INTEGER,
	},
});

module.exports = EpisodeToCharacter;
