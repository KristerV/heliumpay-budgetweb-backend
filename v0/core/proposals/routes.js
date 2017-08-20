const utils = require('../../utils')
const runcli = require('../../core-utils').runCliCmd

module.exports = function(app) {

	app.get('/', async (req, res) => {
		const data = await runcli('gobject list')
		res.json(data)
	})

	app.get('/:hash', async (req, res) => {
		const data = await runcli('gobject get ' + req.params.hash)
		res.json(data)
	})

}
