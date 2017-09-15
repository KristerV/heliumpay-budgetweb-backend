const { User } = require('../../../database/models')
const { NotFoundError, UnauthorizedError } = require('../../errors')

module.exports = async (req, res) => {
	const { id } = req.params
	// cannot update another user
	if (id !== req.token.sub) throw new UnauthorizedError('cannot update user')

	const user = await User.findOne({ id: req.token.sub })
	if (!user) throw new NotFoundError('user not found')

	const updatedUser = await User.update(user.id, { emailConfirmed: true })

	res.json(User.toJSON(updatedUser))
}
