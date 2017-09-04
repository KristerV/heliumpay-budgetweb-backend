const bodyParser = require('body-parser')

module.exports.errors = require('./errors')
module.exports.auth = require('./auth')
module.exports.json = () => bodyParser.json()
