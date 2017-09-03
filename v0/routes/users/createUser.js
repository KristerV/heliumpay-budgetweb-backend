const { User } = require('../../../database/models')
const { BadRequestError } = require('../../errors')
const validateAttributes = require('./validateAttributes')

module.exports = async (req, res) => {
	const attrs = req.body

	const errors = await validateAttributes(attrs)
	if (errors) throw new BadRequestError(errors[0])

	const existingUsername = await User.findOne({ username: attrs.username })
	if (existingUsername) throw new BadRequestError('username is taken')

	if (attrs.email) {
		const existingEmail = await User.findOne({ email: attrs.email })
		if (existingEmail) throw new BadRequestError('email is taken')
		// TODO: email confirmation
	}

	const user = await User.create(
		Object.assign({}, attrs, {
			emailConfirmationHash: null,
			emailConfirmed: false
		})
	)

	res.json(User.stripPrivateFields(user))
}
