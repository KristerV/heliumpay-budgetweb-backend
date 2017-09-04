const { User } = require('../../../database/models')
const { BadRequestError } = require('../../errors')
const validateAttributes = require('./validateAttributes')

module.exports = async (req, res) => {
	const { username, email, password } = req.body

	const errors = await validateAttributes({ username, email, password })
	if (errors) throw new BadRequestError(errors[0])

	const existingUsername = await User.findOne({ username: username })
	if (existingUsername) throw new BadRequestError('username is taken')

	if (email) {
		const existingEmail = await User.findOne({ email: email })
		if (existingEmail) throw new BadRequestError('email is taken')
		// TODO: email confirmation
	}

	const user = await User.create({
		username,
		email,
		password,
		emailConfirmationHash: null,
		emailConfirmed: false
	})

	res.json(User.stripPrivateFields(user))
}
