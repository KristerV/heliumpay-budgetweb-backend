const { User } = require('../../../database/models')
const { UnauthorizedError, NotFoundError } = require('../../errors')
const validateAttributes = require('./validateAttributes')

module.exports = async (req, res) => {
	const { id } = req.params
	// cannot update another user
	if (id !== req.token.sub) throw new UnauthorizedError('cannot get user')

	const user = await User.findOne({ id: req.token.sub })
	if (!user) throw new NotFoundError('user not found')

	res.json(User.stripPrivateFields(user))
}
