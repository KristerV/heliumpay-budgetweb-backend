const { User } = require('../../../database/models')
const { NotFoundError, BadRequestError } = require('../../errors')
const { signJwt } = require('../../utils')
const scopes = require('../../scopes')

module.exports = async (req, res) => {
	const { email } = req.body
	if (!email) throw new BadRequestError('invalid email')

	const user = await User.findOne({ email })
	if (!user) throw new NotFoundError('user not found')

	const token = await signJwt(
		{ scope: scopes.userResetPassword },
		{ subject: `${user.id}`, expiresIn: '5m' }
	)
	// TODO: send reset email

	res.json(true)
}
