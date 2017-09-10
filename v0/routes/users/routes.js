const { auth, json } = require('../../middleware')
const scopes = require('../../scopes')
const createUser = require('./createUser')
const getUser = require('./getUser')
const updateUser = require('./updateUser')

module.exports = app => {
	app.post('/', json(), createUser)
	app.get('/:id', auth(scopes.user), getUser)
	app.put('/:id', auth(scopes.user), json(), updateUser)
	// app.post('/:id', auth(scopes.userConfirmEmail), json(), confirmEmail) // use body.confirmToken to auth
	// app.post('/:id', auth(scopes.user), sendPasswordResetEmail)
	// app.post('/:id', auth(scopes.userResetPassword), json(), resetPassword) // use body.resetToken to auth
}
