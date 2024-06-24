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

// get one
const readOne = async (req, res) => {};

// create one new
const createSingle = async (req, res) => {
	const { name } = req.body;
	const data = await Media.create({ name });

	data
		? jsonCreated(res, data)
		: jsonError(res, `Error: creating media with name ${name}`);
};

// update one
const updateSingle = async (req, res) => {
	const { name } = req.body;

	const isUpdated = await Media.update(req.body, { where: { name } });

	const data = await Media.findOne({ where: { name } });
	jsonUpdated(res, data, { isUpdated: Boolean(isUpdated[0]) });
};

// get
const getAll = async () => await Media.findAll();
const getSingleByName = async (name) =>
	await Media.findOne({ where: { name } });
const getSingleById = async (id) => await Media.findByPk(id);

// update
const updateSingleByName = async (name, body) =>
	Media.update(body, { where: { name } });
const updateSingleById = async (id, body) =>
	Media.update(body, { where: { id } });

// delete
const deleteSingleById = async (id) => Media.destroy({ where: { id } });
const deleteSingleByName = async (name) => Media.destroy({ where: { name } });

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
		const { media, name } = req.body;

		// if id or name exists get single, if media exists et multiple, else get all
		const data = id
			? await getSingleById(id)
			: name
			? await getSingleByName(name)
			: media
			? await getMultiple(media)
			: await getAll();

		data ? jsonSuccess(res, data) : jsonErrorDoesNotExist(res, name);
		return;
	},

	// post
	post: async (req, res) => {
		const { media } = req.body;
		(media ?? [req.body]).forEach((m) => {
			const { name } = m;
			// get
			const single = getSingleByName(name);

			// if exists, error
			if (single) {
				jsonErrorDup(res, m.name);
				return;
			}

			// create
			const data = createSingle(req, res);
			data
				? jsonSuccess(res, data)
				: jsonError(res, `Error: updating ${name}`);
			return;
		});
	},

	// put
	put: async (req, res) => {
		const { media } = req.body;
		(media ?? [req.body]).forEach((m) => {
			const { name } = m;
			// get
			const single = getSingleByName(name);

			// if does not exist, error
			if (!single) {
				jsonErrorDoesNotExist(res);
				return;
			}

			// update
			const data = updateSingleByName(name, m);
			data
				? jsonSuccess(res, data)
				: jsonError(res, `Error: updating ${name}`);
			return;
		});
	},

	// delete
	delete: async (req, res) => {
		const { media } = req.body;
		(media ?? [req.body]).forEach((m) => {
			const { name } = m;
			// get
			const single = getSingleByName(name);

			// if does not exist, error
			if (!single) {
				jsonErrorDoesNotExist(res);
				return;
			}

			// delete
			const data = deleteSingleByName(name);
			data
				? jsonSuccess(res, data)
				: jsonError(res, `Error: deleting ${name}`);
			return;
		});
	},
};
