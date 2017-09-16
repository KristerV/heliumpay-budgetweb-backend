const yup = require('yup')
const { User } = require('../../../database/models')
const { validateSchema } = require('../../utils')
const { BadRequestError } = require('../../errors')

const createInputSchema = yup.object().shape({
	// at least 3 chars, alpha numberic starting with a char, including underscores
	username: yup
		.string()
		.required()
		.matches(
			/^[A-Za-z_][A-Za-z\d_]*$/,
			'username must container only letters, numbers or underscores and start with a letter'
		)
		.min(3),
	// as least 12 chars
	password: yup
		.string()
		.required()
		.min(12),
	email: yup.string().email()
})

const updateInputSchema = yup.object().shape({
	password: yup.string().min(6),
	email: yup.string().email()
})

module.exports.validateCreateAttributes = async attrs => {
	const errors = await validateSchema(createInputSchema, attrs)
	if (errors) throw new BadRequestError(errors[0])

	if (attrs.username) {
		const existingUserWithUsername = await User.findOne({ username: attrs.username })
		if (existingUserWithUsername) throw new BadRequestError('username is taken')
	}

	if (attrs.email) {
		const existingUserWithEmail = await User.findOne({ email: attrs.email })
		if (existingUserWithEmail) throw new BadRequestError('email is taken')
	}
}

module.exports.validateUpdateAttributes = async (attrs, userToUpdate) => {
	const errors = await validateSchema(updateInputSchema, attrs)
	if (errors) throw new BadRequestError(errors[0])

	if (attrs.username) {
		if (userToUpdate) throw new BadRequestError('cannot change username')

		const existingUserWithUsername = await User.findOne({ username: attrs.username })
		if (existingUserWithUsername && userToUpdate.id !== existingUserWithUsername.id)
			throw new BadRequestError('username is taken')
	}

	if (attrs.email) {
		const existingUserWithEmail = await User.findOne({ email: attrs.email })
		if (existingUserWithEmail && userToUpdate && userToUpdate.id !== existingUserWithEmail.id)
			throw new BadRequestError('email is taken')
	}
}
