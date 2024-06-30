const { Sequelize } = require("sequelize");

// create sequelize db
const sequelize = new Sequelize({
	dialect: "sqlite",
	host: "C:/Users/britk/Documents/Development/voices/back-end/dev.sqlite",
});

// connect db
const connectDB = async () => {
	// Synchronize
	sequelize.sync();

	await sequelize.authenticate();
	console.log("Connected to DB".yellow.underline);
};

module.exports = { sequelize, connectDB };
