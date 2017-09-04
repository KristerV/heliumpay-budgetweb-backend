const { json } = require('../../middleware')
const generateAuthToken = require('./generateAuthToken')

module.exports = function(app) {
	app.post('/', json(), generateAuthToken)
}
