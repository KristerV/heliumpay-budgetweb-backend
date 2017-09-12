const runcli = require('../core-utils').runCliCmd
const statuses = require('./statuses')
const funding = require('./funding')

module.exports = function(app) {
	app.get('/', async (req, res) => {
		const proposalListResult = await runcli(['gobject', 'list'])
		const withStatuses = await statuses.addListStatuses(proposalListResult)
		let proposalsList = Object.values(withStatuses)
		if (req.query.status)
			proposalsList = proposalsList.filter(proposal => req.query.status === proposal.status)
		const [list] = await funding.addIsGettingFunded(proposalsList)
		res.json(list)
	})

	app.get('/:hash', async (req, res) => {
		const proposalListResult = await runcli(['gobject', 'list'])
		const withStatuses = await statuses.addListStatuses(proposalListResult)
		const proposalArray = Object.values(withStatuses)
		const proposalsListFiltered = proposalArray.filter(proposal => 'active' === proposal.status)

		const proposalResult = await runcli(['gobject', 'get', req.params.hash])

		const [proposalList, proposal] = await funding.addIsGettingFunded(
			proposalsListFiltered,
			proposalResult
		)
		res.json(proposal)
	})
}
