const { json } = require('../../middleware')
const generateAuthToken = require('./generateAuthToken')
const sendPasswordResetEmail = require('./sendPasswordResetEmail')

module.exports = app => {
	app.post('/', json(), generateAuthToken)
	app.post('/sendPasswordResetEmail', json(), sendPasswordResetEmail)
}
