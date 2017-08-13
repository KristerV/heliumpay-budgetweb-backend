const utils = require('../../../utils')
const runcli = require('../../runCliCmd')

module.exports = function(app) {

	app.get('/count', async (req, res) => {
		const data = await runcli('gobject count')
		const obj = {count: data}
		res.send(utils.formatResponse(obj, req))
	})

	app.get('/list', async (req, res) => {
		const data = await runcli('gobject list')
		res.send(utils.formatResponse(data, req))
	})

	
}