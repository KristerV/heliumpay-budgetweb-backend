const runcli = require('./runCliCmd')
module.exports = exports = {};

exports.getgovernanceinfo = async function() {
	return await runcli('getgovernanceinfo')
}