const { User } = require('../../../database/models')
const { BadRequestError } = require('../../errors')
const { signJwt } = require('../../utils')
const scopes = require('../../scopes')
const { validateCreateAttributes } = require('./validateAttributes')

module.exports = async (req, res) => {
	const { username, email, password } = req.body

	await validateCreateAttributes({ username, email, password })

	const user = await User.create({
		username,
		email,
		password,
		emailConfirmed: false
	})

	if (email) {
		const token = await signJwt(
			{ scope: scopes.userConfirmEmail },
			{ subject: `${user.id}`, expiresIn: '5m' }
		)
		// TODO: send confirmation email with token
	}

	res.json(User.stripPrivateFields(user))
}
