const { User } = require('../../../database/models')

module.exports = async (req, res) => {
	const attrs = req.body
	// TODO: validate attrs
	const user = await User.create(
		Object.assign({}, attrs, {
			emailConfirmationHash: null,
			emailConfirmed: false
		})
	)

	res.json(User.stripPrivateFields(user))
}
