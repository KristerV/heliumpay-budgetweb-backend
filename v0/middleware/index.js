const bodyParser = require('body-parser')

module.exports.errors = require('./errors')
module.exports.json = () => bodyParser.json()
