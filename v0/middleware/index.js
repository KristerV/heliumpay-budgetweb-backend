const bodyParser = require('body-parser')

module.exports.errors = require('./errors')
module.exports.auth = require('./auth')
module.exports.hashid = require('./hashid')
module.exports.json = () => bodyParser.json()
