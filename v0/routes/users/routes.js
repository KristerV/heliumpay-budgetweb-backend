const { auth, json } = require('../../middleware')
const scopes = require('../../scopes')
const createUser = require('./createUser')
const getUser = require('./getUser')
const updateUser = require('./updateUser')
const confirmEmail = require('./confirmEmail')

module.exports = app => {
	app.post('/', json(), createUser)
	app.get('/:id', auth(scopes.user), getUser)
	app.put('/:id', auth(scopes.user), json(), updateUser)
	app.post('/:id/confirmEmail', auth(scopes.userConfirmEmail), json(), confirmEmail)
	// app.post('/:id', auth(scopes.user), sendPasswordResetEmail)
	// app.post('/:id', auth(scopes.userResetPassword), json(), resetPassword) // use body.resetToken to auth
}
