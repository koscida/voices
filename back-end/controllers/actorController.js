const Actor = require("../models/actorModel");
const {
	jsonSuccess,
	jsonCreated,
	jsonUpdated,
	jsonError,
	jsonErrorDup,
	jsonErrorDoesNotExist,
} = require("./functions");

module.exports = {
	// post
	post: async (req, res) => {
		const { name } = req.body;

		// get
		const single = await Actor.findOne({ where: { name } });

		// if exists, error
		if (single) {
			jsonErrorDup(res, name);
			return;
		}

		// create
		const data = await Actor.create(req.body);

		// return
		data
			? jsonCreated(res, data)
			: jsonError(res, `Error: creating ${name}`);
		return;
	},

	// get
	get: async (req, res) => {
		const { id } = req.params;
		const { name } = req.body;

		// get
		const data = id
			? await Actor.findOne({ where: { name } })
			: name
			? await Actor.findOne({ where: { id } })
			: await Actor.findAll();

		// return
		data ? jsonSuccess(res, data) : jsonErrorDoesNotExist(res, name ?? id);
		return;
	},

	// put
	put: async (req, res) => {
		const { id } = req.params;
		const { name } = req.body;

		// get
		const single = name
			? await Actor.findOne({ where: { name } })
			: await Actor.findOne({ where: { id } });

		// if does not exist, error
		if (!single) {
			jsonErrorDoesNotExist(res, name ?? id);
			return;
		}

		// update
		const isUpdated = name
			? Actor.findOne({ where: { name } })
			: Actor.findOne({ where: { id } });

		// if updated get data
		const data = isUpdated
			? name
				? await Actor.findOne({ where: { name } })
				: await Actor.findOne({ where: { id } })
			: 0;

		// return
		data
			? jsonUpdated(res, data)
			: jsonError(res, `Error: updating ${name ?? id}`);
		return;
	},

	// delete
	delete: async (req, res) => {
		const { id } = req.params;
		const { name } = req.body;

		// get
		const single = name
			? await Actor.findOne({ where: { name } })
			: await Actor.findOne({ where: { id } });

		// if does not exist, error
		if (!single) {
			jsonErrorDoesNotExist(name ?? id);
			return;
		}

		// delete
		const isDeleted = name
			? await Actor.destroy({ where: { name } })
			: await Actor.destroy({ where: { id } });

		// if deleted return the last known
		const data = isDeleted ? single : 0;

		// return
		data
			? jsonSuccess(res, data)
			: jsonError(res, `Error: deleting ${name ?? id}`);
		return;
	},
};
