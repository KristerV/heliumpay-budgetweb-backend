const { auth, json } = require('../../middleware')
const createUser = require('./createUser')
const getUser = require('./getUser')
const updateUser = require('./updateUser')

module.exports = app => {
	app.post('/', json(), createUser)
	app.get('/:id', auth(), getUser)
	app.put('/:id', auth(), json(), updateUser)
}
