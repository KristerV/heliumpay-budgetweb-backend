const cli = require('../cli')
const utils = require('./utils')

module.exports = function(app) {
	app.get('/', async (req, res) => {
		res.send(utils.formatResponse(await cli.getgovernanceinfo(), req))
	})
}