const yup = require('yup')
const { User } = require('../../../database/models')
const { validateSchema } = require('../../utils')
const { BadRequestError } = require('../../errors')

// at least 3 chars, alpha numberic starting with a char, including underscores
const usernameSchema = yup
	.string()
	.matches(
		/^[A-Za-z_][A-Za-z\d_]*$/,
		'username must container only letters, numbers or underscores and start with a letter'
	)
	.min(3)

// as least 12 chars
const passwordSchema = yup.string().min(12)

const emailSchema = yup.string().email()

const createInputSchema = yup.object().shape({
	username: usernameSchema.required(),
	password: passwordSchema.required(),
	email: emailSchema
})

const updateInputSchema = yup.object().shape({
	password: usernameSchema,
	email: emailSchema
})

const validatePassword = async password => {
	const errors = await validateSchema(passwordSchema, password)
	if (errors) throw new BadRequestError(errors[0])
}

const validateCreateAttributes = async attrs => {
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

const validateUpdateAttributes = async (attrs, userToUpdate) => {
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

module.exports = {
	validatePassword,
	validateCreateAttributes,
	validateUpdateAttributes
}
