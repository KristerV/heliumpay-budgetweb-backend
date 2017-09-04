const { auth, json } = require('../../middleware')
const createUser = require('./createUser')
const getUser = require('./getUser')

module.exports = function(app) {
	app.post('/', json(), createUser)
	app.get('/self', auth(), getUser)
}
