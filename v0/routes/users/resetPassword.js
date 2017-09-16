const { User } = require('../../../database/models')
const { NotFoundError } = require('../../errors')
const { validatePassword } = require('./validateAttributes')

module.exports = async (req, res) => {
	const { id } = req.params
	const { password } = req.body
	// cannot update another user
	if (id !== req.token.sub) throw new UnauthorizedError('cannot update user')

	const user = await User.findOne({ id: req.token.sub })
	if (!user) throw new NotFoundError('user not found')

	await validatePassword(password)
	const updatedUser = await User.update(user.id, { password })

	res.json(User.toJSON(updatedUser))
}
