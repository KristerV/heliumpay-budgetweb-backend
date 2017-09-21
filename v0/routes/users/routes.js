const { auth, json, hashid } = require('../../middleware')
const scopes = require('../../scopes')
const createUser = require('./createUser')
const getUser = require('./getUser')
const updateUser = require('./updateUser')
const confirmEmail = require('./confirmEmail')
const resetPassword = require('./resetPassword')

module.exports = app => {
	app.post('/', json(), hashid(), createUser)
	app.get('/:id', auth(scopes.user), hashid(), getUser)
	app.put('/:id', auth(scopes.user), json(), hashid(), updateUser)
	app.post('/:id/confirmEmail', auth(scopes.userConfirmEmail), json(), hashid(), confirmEmail)
	app.post('/:id/resetPassword', auth(scopes.userResetPassword), json(), hashid(), resetPassword)
}
