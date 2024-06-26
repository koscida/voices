// server/index.js

const express = require("express");
require("express-async-errors");
require("colors");
const allRoutes = require("../routes/allRoutes.js");
const { connectDB } = require("./db.js");
const cors = require("cors");

const PORT = process.env.PORT || 3001;
const app = express();

//connection to DB
connectDB();

// Parse request
app.use(express.json());

// using middlewares
app.use(cors());

// using router
app.use("/", allRoutes);

// app.get("/puppeteer", express.static("../puppeteer/react-crawler.js"));

// ////
// app.listen
// Original:
app.listen(PORT, () => {
	console.log(`Server listening on ${PORT}`);
});
// With sqlite:
// db.sync({ force: false }).then(() => {
// 	app.listen(PORT, console.log("Server is running on port: " + PORT));
// });

// ////
// tutorials:
// mvc:
// https://blog.logrocket.com/building-structuring-node-js-mvc-application/
// https://www.sitepoint.com/node-js-mvc-application/#definingtheroutes
// sqlite:
// https://medium.com/@msaidozturk1/connecting-sqlite-to-node-js-express-with-sequelize-636e0853bb4b
