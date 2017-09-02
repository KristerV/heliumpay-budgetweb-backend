const { json } = require('../../middleware')
const registerUser = require('./registerUser')

module.exports = function(app) {
	app.post('/', json(), registerUser)
}
