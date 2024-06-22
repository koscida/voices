const sqlite3 = require("sqlite3").verbose();

// TRY 1:
// const dbPath = "database.db"; // give path to database

// // Create a new SQLite database instance
// const db = new sqlite3.Database(dbPath, (err) => {
// 	if (err) {
// 		console.error("Error connecting to the database:", err.message);
// 	} else {
// 		console.log("Connected to the database.");
// 	}
// });
// // Export the configured database connection for use in other parts of your application
// module.exports = db;

// TRY 2:
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize({
	dialect: "sqlite",
	host: "./dev.sqlite",
});

const connectDB = async () => {
	// Synchronize
	sequelize.sync();

	await sequelize.authenticate();
	console.log("Connected to DB".yellow.underline);
};

module.exports = { sequelize, connectDB };

// TRY 3:
// open database in memory
// let db = new sqlite3.Database("./voices.db", (err) => {
// 	if (err) {
// 		return console.error(err.message);
// 	}
// 	console.log("Connected to the in-memory SQlite database.");
// });

// // close the database connection
// db.close((err) => {
// 	if (err) {
// 		return console.error(err.message);
// 	}
// 	console.log("Close the database connection.");
// });
