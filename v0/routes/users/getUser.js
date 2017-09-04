const { User } = require('../../../database/models')
const { NotFoundError } = require('../../errors')
const validateAttributes = require('./validateAttributes')

module.exports = async (req, res) => {
	const user = await User.findOne({ id: req.token.sub })
	if (!user) throw new NotFoundError('user not found')

	res.json(User.stripPrivateFields(user))
}
