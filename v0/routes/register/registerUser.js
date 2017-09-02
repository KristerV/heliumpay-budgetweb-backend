const { User } = require('../../../database/models')

module.exports = async (req, res) => {
	const attrs = req.body
	// TODO: validate attrs
	const user = await User.create(attrs)
	res.json(user)
}
