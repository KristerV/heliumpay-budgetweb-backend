const uuid = require('node-uuid')
const { User } = require('../../../database/models')
const { UnauthorizedError, BadRequestError, NotFoundError } = require('../../errors')
const { validateUpdateAttributes } = require('./validateAttributes')

module.exports = async (req, res) => {
	const { id } = req.params
	const { username, email, password } = req.body
	// cannot update another user
	if (id !== req.token.sub) throw new UnauthorizedError('cannot update user')

	const user = await User.findOne({ id: req.token.sub })
	if (!user) throw new NotFoundError('user not found')

	await validateUpdateAttributes({ username, email, password }, user)

	let emailConfirmationToken
	let emailConfirmed

	// if email is being updated, send new confirmation email
	if (email && email !== user.email) {
		emailConfirmationToken = uuid.v4()
		emailConfirmed = false
		// TODO: send confirmation email
	}

	const updatedUser = await User.update(user.id, {
		email,
		password,
		emailConfirmationToken,
		emailConfirmed
	})

	res.json(User.stripPrivateFields(updatedUser))
}
