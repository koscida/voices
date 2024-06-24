const Actor = require("../models/actorModel");
const { jsonSuccess, jsonCreated, jsonError } = require("./functions");

module.exports = {
	// get one by name
	getSingle: async (req, res) => {
		const { name } = req.body;

		const data = await Actor.findOne({ where: { name } });

		data
			? jsonSuccess(res, data)
			: jsonError(res, `Error: actor with name ${name} does not exist`);
	},

	// get one by id
	getSingleById: async (req, res) => {
		const { id } = req.params;
		const data = await Actor.findByPk(id);

		data
			? jsonSuccess(res, data)
			: jsonError(res, `Error: actor with id ${id} does not exist`);
	},

	// create one new
	createSingle: async (req, res) => {
		const { name } = req.body;
		const data = await Actor.create({ name });

		data
			? jsonCreated(res, data)
			: jsonError(res, `Error: creating actor with name ${name}`);
	},
};
