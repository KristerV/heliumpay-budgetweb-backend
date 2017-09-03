const { json } = require('../../middleware')
const createUser = require('./createUser')

module.exports = function(app) {
	app.post('/', json(), createUser)
}
