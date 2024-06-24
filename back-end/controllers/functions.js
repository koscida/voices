module.exports = {
	jsonSuccess: (res, data, status = "200", message = "Success") => {
		res.status(status).json({
			error: false,
			message,
			data,
		});
	},
	jsonCreated: (res, data) => {
		this.jsonSuccess(res, data, 201, "Created");
	},
	jsonUpdated: (res, data) => {
		this.jsonSuccess(res, data, 202, "Updated");
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
