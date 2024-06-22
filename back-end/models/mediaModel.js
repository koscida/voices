// const mediaModel = {
// 	name: "Movie Name",
// 	posterUrl: "images/640x360.png",
// 	posterAlt: "poster",
// 	characters: [],
// };

const { DataTypes } = require("sequelize");
const { sequelize } = require("../server/db");

const Media = sequelize.define("medias", {
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

	characters: {
		type: DataTypes.STRING,
	},
});

module.exports = Media;
