// const mediaToCharactersModel = {
// 	mediaId: 1,
//	characterId: 1,
// };

const { DataTypes } = require("sequelize");
const { sequelize } = require("../server/db");

const MediaToCharacter = sequelize.define("mediaToCharacters", {
	id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		primaryKey: true,
	},
	mediaId: {
		type: DataTypes.INTEGER,
	},
	characterId: {
		type: DataTypes.INTEGER,
	},
});

module.exports = MediaToCharacter;
