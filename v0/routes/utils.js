module.exports.getValidationErrors = async (schema, data) => {
	try {
		await schema.validate(data)
	} catch (err) {
		// if it's a validation error, return errors array
		if (err.errors) {
			return err.errors
		} else {
			throw err
		}
	}
}
