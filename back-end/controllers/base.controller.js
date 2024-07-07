const {
	jsonSuccess,
	jsonCreated,
	jsonUpdated,
	jsonError,
	jsonErrorDup,
	jsonErrorDoesNotExist,
} = require("./functions");

// ////
// Endpoints

module.exports = {
	// post
	post: async (Model, nameLabel, req, res) => {
		const name = req.body.nameLabel;

		// get
		const single = await Model.findOne({ where: { [nameLabel]: name } });

		// if exists, error
		if (single) {
			jsonErrorDup(res, name);
			return;
		}

		// create
		const data = await Model.create(req.body);

		// return
		data
			? jsonCreated(res, data)
			: jsonError(res, `Error: creating ${name}`);
		return;
	},

	// get
	get: async (Model, nameLabel, req, res) => {
		const { id } = req.params;
		const name = req.body[nameLabel];

		// get
		const data = name
			? await Model.findOne({ where: { [nameLabel]: name } })
			: id
			? await Model.findOne({
					where: { id },
			  })
			: await Model.findAll({ order: [[nameLabel, "ASC"]] });

		// return
		data ? jsonSuccess(res, data) : jsonErrorDoesNotExist(res, name ?? id);
		return;
	},

	// put
	put: async (Model, nameLabel, req, res) => {
		const { id } = req.params;
		const name = req.body.nameLabel;

		// get
		const single = name
			? await Model.findOne({ where: { [nameLabel]: name } })
			: await Model.findOne({ where: { id } });

		// if does not exist, error
		if (!single) {
			jsonErrorDoesNotExist(res, name ?? id);
			return;
		}

		// update
		const isUpdated = name
			? Model.findOne({ where: { [nameLabel]: name } })
			: Model.findOne({ where: { id } });

		// if updated get data
		const data = isUpdated
			? name
				? await Model.findOne({ where: { [nameLabel]: name } })
				: await Model.findOne({ where: { id } })
			: 0;

		// return
		data
			? jsonUpdated(res, data)
			: jsonError(res, `Error: updating ${name ?? id}`);
		return;
	},

	// delete
	delete: async (Model, nameLabel, req, res) => {
		const { id } = req.params;
		const name = req.body.nameLabel;

		// get
		const single = name
			? await Model.findOne({ where: { [nameLabel]: name } })
			: await Model.findOne({ where: { id } });

		// if does not exist, error
		if (!single) {
			jsonErrorDoesNotExist(name ?? id);
			return;
		}

		// delete
		const isDeleted = name
			? await Model.destroy({ where: { [nameLabel]: name } })
			: await Model.destroy({ where: { id } });

		// if deleted return the last known
		const data = isDeleted ? single : 0;

		// return
		data
			? jsonSuccess(res, data)
			: jsonError(res, `Error: deleting ${name ?? id}`);
		return;
	},

	//

	// post with parent
	postWithParent: async (ChildModel, ParentModel, parentKey, req, res) => {
		const parentId = req.params[parentKey];
		const { name } = req.body;

		// get parent
		const parent = await ParentModel.findOne({ where: { id: parentId } });

		// if does NOT exist, error
		if (!parent) {
			jsonErrorDoesNotExist(res, parentId);
			return;
		}

		// get child
		const single = await ChildModel.findOne({
			where: { name, [parentKey]: parentId },
		});

		// if exists, error
		if (single) {
			jsonErrorDup(res, name);
			return;
		}

		// create child
		const newSingle = { ...req.body, [parentKey]: parentId };
		const data = await ChildModel.create(newSingle);

		// return
		data
			? jsonCreated(res, data)
			: jsonError(res, `Error: creating ${name}`);
		return;
	},

	// get with parent
	getWithParent: async (ChildModel, ParentModel, parentKey, req, res) => {
		const parentId = req.params[parentKey];
		const { id } = req.params;
		const { name } = req.body;

		// get parent
		const parent = await ParentModel.findOne({ where: { id: parentId } });

		// if does NOT exist, error
		if (!parent) {
			jsonErrorDoesNotExist(res, parentId);
			return;
		}

		// get
		const data = await (id
			? ChildModel.findOne({ where: { name, [parentKey]: parentId } })
			: name
			? ChildModel.findOne({ where: { id, [parentKey]: parentId } })
			: ChildModel.findAll({ where: { [parentKey]: parentId } }));

		// return
		data ? jsonSuccess(res, data) : jsonErrorDoesNotExist(res, name ?? id);
		return;
	},
};
