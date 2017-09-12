const runcli = require('../core-utils').runCliCmd

async function addIsGettingFunded(proposalList, proposal) {
	proposal = Object.assign({}, proposal || {})
	proposalList = proposalList.slice()

	const govinfo = await runcli('getgovernanceinfo')
	const masternodeCount = await runcli(['masternode', 'count', 'enabled'])
	let budgetRemaining = await runcli(['getsuperblockbudget', govinfo.nextsuperblock])

	// Sort by votes
	proposalList.sort((a, b) => b.AbsoluteYesCount - a.AbsoluteYesCount)

	let newProposalList = []
	for (var i = 0; i < proposalList.length; i++) {
		let prop = proposalList[i]
		const dataString = JSON.parse(prop.DataString)[0][1]

		budgetRemaining -= Math.max(dataString.payment_amount, 0)
		isEnoughBudget = budgetRemaining > 0
		isEnoughVotes = masternodeCount * 0.1 < prop.AbsoluteYesCount
		isGettingFunded = isEnoughBudget && isEnoughVotes
		if (prop.Hash === proposal.Hash) {
			proposal.isEnoughBudget = isEnoughBudget
			proposal.isEnoughVotes = isEnoughVotes
			proposal.isGettingFunded = isGettingFunded
		} else {
			newProposalList.push(
				Object.assign({ isEnoughBudget, isEnoughVotes, isGettingFunded }, prop)
			)
		}
	}

	return [newProposalList, proposal]
}
module.exports.addIsGettingFunded = addIsGettingFunded
