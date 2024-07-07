const { DataTypes } = require("sequelize");
const { sequelize } = require("../server/db");

// Media
const Media = sequelize.define("Media", {
	id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		primaryKey: true,
	},
	mediaName: {
		type: DataTypes.STRING,
		unique: true,
	},
	mediaPosterUrl: {
		type: DataTypes.STRING,
		defaultValue: null,
	},
	mediaPosterAlt: {
		type: DataTypes.STRING,
		defaultValue: null,
	},
});
exports.Media = Media;

// Character
const Character = sequelize.define("Characters", {
	id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		primaryKey: true,
	},
	key: {
		type: DataTypes.STRING,
		unique: true,
	},
	characterName: {
		type: DataTypes.STRING,
	},
	characterPosterUrl: {
		type: DataTypes.STRING,
		defaultValue: null,
	},
	characterPosterAlt: {
		type: DataTypes.STRING,
		defaultValue: null,
	},

	mediaId: {
		type: DataTypes.INTEGER,
	},
	characterTotalEpisodes: {
		type: DataTypes.INTEGER,
		defaultValue: null,
	},
});
exports.Character = Character;

// Actor
const Actor = sequelize.define("Actors", {
	id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		primaryKey: true,
	},
	actorName: {
		type: DataTypes.STRING,
		unique: true,
	},
	actorPosterUrl: {
		type: DataTypes.STRING,
		defaultValue: null,
	},
	actorPosterAlt: {
		type: DataTypes.STRING,
		defaultValue: null,
	},
});
exports.Actor = Actor;

// Actor-to-Character
const ActorToCharacter = sequelize.define("ActorToCharacters", {
	id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		primaryKey: true,
	},
	episodes: {
		type: DataTypes.INTEGER,
		defaultValue: null,
	},
	yearStart: {
		type: DataTypes.INTEGER,
		defaultValue: null,
	},
	yearEnd: {
		type: DataTypes.INTEGER,
		defaultValue: null,
	},
});
exports.ActorToCharacter = ActorToCharacter;

// Relationships

// Media-Character
Media.hasMany(Character);
Character.belongsTo(Media);

// The Super Many-to-Many relationship
Character.belongsToMany(Actor, {
	through: ActorToCharacter,
});
Actor.belongsToMany(Character, {
	through: ActorToCharacter,
});
Character.hasMany(ActorToCharacter);
ActorToCharacter.belongsTo(Character);
Actor.hasMany(ActorToCharacter);
ActorToCharacter.belongsTo(Actor);

// sync
// sequelize
// 	.sync({ force: true })
// 	.then(() => {
// 		console.info("Model synchronization completed");
// 	})
// 	.catch((error) => {
// 		console.error("Unable to create table : ", error);
// 	});
