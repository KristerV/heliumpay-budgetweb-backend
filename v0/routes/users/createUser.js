const uuid = require('node-uuid')
const { User } = require('../../../database/models')
const { BadRequestError } = require('../../errors')
const { validateCreateAttributes } = require('./validateAttributes')

module.exports = async (req, res) => {
	const { username, email, password } = req.body

	await validateCreateAttributes({ username, email, password })

	let emailConfirmationToken
	if (email) {
		emailConfirmationToken = uuid.v4()
		// TODO: send confirmation email
	}

	const user = await User.create({
		username,
		email,
		password,
		emailConfirmationToken,
		emailConfirmed: false
	})

	res.json(User.stripPrivateFields(user))
}
