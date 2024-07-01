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
	},
	mediaPosterUrl: {
		type: DataTypes.STRING,
	},
	mediaPosterAlt: {
		type: DataTypes.STRING,
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
	characterName: {
		type: DataTypes.STRING,
	},
	characterPosterUrl: {
		type: DataTypes.STRING,
	},
	characterPosterAlt: {
		type: DataTypes.STRING,
	},

	mediaId: {
		type: DataTypes.INTEGER,
	},
	characterTotalEpisodes: {
		type: DataTypes.INTEGER,
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
	},
	actorPosterUrl: {
		type: DataTypes.STRING,
	},
	actorPosterAlt: {
		type: DataTypes.STRING,
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
