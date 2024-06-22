const Media = require("../models/mediaModel");

module.exports = {
	mediaView: (req, res) => {
		res.json({ message: "Hello from server!" });
	},
};
