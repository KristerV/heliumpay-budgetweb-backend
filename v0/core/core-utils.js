const child_process = require('child_process')
const conf = require('../config')

module.exports.runCliCmd = async function(cmd) {
	let data
	try {
		data = await new Promise((resolve, reject) => {
			child_process.exec(conf["cli-command"] + ' ' + cmd, (err, result) => {
				if (err)
					reject(err)
				else
					resolve(result)
			})
		})
		data.status = 200;
	} catch(e) {
		data = {
			status: 500,
			command: e.cmd,
			message: e.toString().replace(/\n/g, '; ')
		};
	}

	// Try return an object
	if (typeof data === 'string') {
		try {
			data = JSON.parse(data)
		} catch(e) {console.warn("runCliCmd: Can't JSON.parse this string")}
	}

	return data
}