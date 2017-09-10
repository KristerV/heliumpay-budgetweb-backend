const { json } = require('../../middleware')
const generateAuthToken = require('./generateAuthToken')

module.exports = app => {
	app.post('/', json(), generateAuthToken)
}
