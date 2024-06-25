// const mediaToEpisodesModel = {
// 	mediaId: 1,
//	episodeId: 1,
// };

const { DataTypes } = require("sequelize");
const { sequelize } = require("../server/db");

const MediaToEpisode = sequelize.define("mediaToEpisodes", {
	id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		primaryKey: true,
	},
	mediaId: {
		type: DataTypes.INTEGER,
	},
	episodeId: {
		type: DataTypes.INTEGER,
	},
});

module.exports = MediaToEpisode;
