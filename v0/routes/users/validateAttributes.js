const yup = require('yup')
const { getValidationErrors } = require('../../utils')

const schema = yup.object().shape({
	username: yup.string().required(),
	password: yup
		.string()
		.required()
		.min(6),
	email: yup.string()
})

module.exports = async attrs => {
	const errors = await getValidationErrors(schema, attrs)
	return errors
}
