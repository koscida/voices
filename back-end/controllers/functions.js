module.exports = {
	jsonSuccess: (res, data) => {
		res.status(200).json({
			error: false,
			message: "Success",
			data,
		});
	},
	jsonCreated: (res, data) => {
		res.status(201).json({
			error: false,
			message: "Created",
			data,
		});
	},
	jsonUpdated: (res, data) => {
		res.status(202).json({
			error: false,
			message: "Updated",
			data,
		});
	},
	jsonError: (res, message) => {
		res.status(400).json({
			error: true,
			message,
		});
	},
	jsonErrorDup: (res, key) => {
		res.status(400).json({
			error: true,
			message: `Error: duplicate on ${key}`,
		});
	},
	jsonErrorDoesNotExist: (res, key) => {
		res.status(400).json({
			error: true,
			message: `Error: media does not exist ${key}`,
		});
	},
};
