// NOTE: this module is mocked for testing, any methods added to the
// return type of getClient need to be mocked in setupTests.js
const getClient = require('./getClient')

module.exports.sendEmailConfirmation = async (to, userId, token) => {
	const client = getClient()
	return client.send({
		to,
		from: process.env.SUPPORT_EMAIL,
		subject: 'Email Confirmation',
		text: `${process.env.FRONTEND_URL}/users/${userId}/confirmEmail?token=${token}`
	})
}

module.exports.sendPasswordReset = async (to, userId, token) => {
	const client = getClient()
	return client.send({
		to,
		from: process.env.SUPPORT_EMAIL,
		subject: 'Reset Password',
		text: `${process.env.FRONTEND_URL}/users/${userId}/resetPassword?token=${token}`
	})
}
