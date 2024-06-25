const Media = require("../models/mediaModel");
const {
	jsonSuccess,
	jsonCreated,
	jsonUpdated,
	jsonError,
	jsonErrorDup,
	jsonErrorDoesNotExist,
} = require("./functions");

// ////
// CRUD

// create
const createSingle = async (body) => await Media.create(body);

// read
const getAll = async () => await Media.findAll();
const getSingleByName = async (name) =>
	await Media.findOne({ where: { name } });
const getSingleById = async (id) => await Media.findByPk(id);

// update
const updateSingleByName = async (name, body) =>
	await Media.update(body, { where: { name } });
const updateSingleById = async (id, body) =>
	await Media.update(body, { where: { id } });

// delete
const deleteSingleById = async (id) => await Media.destroy({ where: { id } });
const deleteSingleByName = async (name) =>
	await Media.destroy({ where: { name } });

// ////
// Functions

// get single with history
const getActorHistory = async (req, res) => {
	const { name, history } = req.body;
	let data = {};

	// Get media
	const media = await Media.findOne({ where: { name } });
	if (!media) {
		jsonError(res, `Error: media with name ${name} does not exist`);
		return;
	}
	data.media = media;

	// Get characters

	// Get actors

	// Get actors other media

	// Build data
	//const data = { ...media, characters };

	jsonSuccess(res, data);
};

// ////
// Endpoints

module.exports = {
	// get
	get: async (req, res) => {
		const { id } = req.params;
		const { name } = req.body;

		// get
		const data = id
			? await getSingleById(id)
			: name
			? await getSingleByName(name)
			: await getAll();

		// return
		data ? jsonSuccess(res, data) : jsonErrorDoesNotExist(res, name ?? id);
		return;
	},

	// post
	post: async (req, res) => {
		const { id } = req.params;
		const { name } = req.body;

		// get
		const single = name
			? await getSingleByName(name)
			: await getSingleById(id);

		// if exists, error
		if (single) {
			jsonErrorDup(res, name ?? id);
			return;
		}

		// create
		const data = await createSingle(req.body);

		// return
		data
			? jsonCreated(res, data)
			: jsonError(res, `Error: creating ${name ?? id}`);
		return;
	},

	// put
	put: async (req, res) => {
		const { id } = req.params;
		const { name } = req.body;

		// get
		const single = name
			? await getSingleByName(name)
			: await getSingleById(id);

		// if does not exist, error
		if (!single) {
			jsonErrorDoesNotExist(res, name ?? id);
			return;
		}

		// update
		const isUpdated = name
			? await updateSingleByName(name, req.body)
			: await updateSingleById(id);

		// if updated get data
		const data = isUpdated
			? name
				? await getSingleByName(name)
				: await getSingleById(id)
			: 0;

		// return
		data
			? jsonSuccess(res, data)
			: jsonError(res, `Error: updating ${name ?? id}`);
		return;
	},

	// delete
	delete: async (req, res) => {
		const { id } = req.params;
		const { name } = req.body;

		// get
		const single = name
			? await getSingleByName(name)
			: await getSingleById(id);

		// if does not exist, error
		if (!single) {
			jsonErrorDoesNotExist(name ?? id);
			return;
		}

		// delete
		const isDeleted = name
			? await deleteSingleByName(name)
			: await deleteSingleById(id);

		// if deleted return the last known
		const data = isDeleted ? single : 0;

		// return
		data
			? jsonSuccess(res, data)
			: jsonError(res, `Error: deleting ${name ?? id}`);
		return;
	},
};
