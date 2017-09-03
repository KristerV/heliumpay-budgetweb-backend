const yup = require('yup')

const schema = yup.object().shape({
	username: yup.string().required(),
	password: yup
		.string()
		.required()
		.min(6),
	email: yup.string()
})

module.exports = async attrs => {
	try {
		await schema.validate(attrs)
	} catch (err) {
		// if it's a validation error, return errors array
		if (err.errors) {
			return err.errors
		} else {
			throw err
		}
	}
}
