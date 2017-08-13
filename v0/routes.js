const utils = require('./utils')

module.exports = function(app) {

	app.get('/', async (req, res) => {
		const data = {
			message: "testing"
		}
		res.send(utils.formatResponse(data, req))
	})

}


