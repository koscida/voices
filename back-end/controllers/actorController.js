const Actor = require("../models/actorModel");

module.exports = {
	// get one actor by name
	actorView: async (req, res) => {
		const { name } = req.body;

		const actor = await Actor.findOne({ where: { name } });

		if (actor) {
			res.status(200).json({
				error: false,
				message: "Success view from server!",
				data: actor,
			});
		} else {
			res.status(400).json({
				error: true,
				message: `Error: actor with name ${name} does not exist`,
			});
		}
	},

	// get one actor by id
	actorViewById: async (req, res) => {
		const actor = await Actor.findByPk(req.params.id);
		res.status(200).json({
			error: false,
			message: `Actor with id ${req.params.id} is fetched`,
			result: actor,
		});
	},

	// create one new actor
	actorCreate: async (req, res) => {
		const { name } = req.body;

		const actor = await Actor.create({ name });

		if (actor) {
			res.status(201).json({
				error: false,
				message: "Actor created",
				data: actor,
			});
		} else {
			res.status(400).json({
				error: true,
				message: `Error: creating actor with name ${name}`,
			});
		}
	},
};
