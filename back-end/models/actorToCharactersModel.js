// const actorToCharactersModel = {
// 	actorId: 1,
//	characterId: 1,
// };

const { DataTypes } = require("sequelize");
const { sequelize } = require("../server/db");

const ActorToCharacter = sequelize.define("actorToCharacters", {
	id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		primaryKey: true,
	},
	actorId: {
		type: DataTypes.INTEGER,
	},
	characterId: {
		type: DataTypes.INTEGER,
	},
});

module.exports = ActorToCharacter;
