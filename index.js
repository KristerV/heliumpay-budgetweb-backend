const child_process = require('child_process')
const express = require('express')
const app = express()

app.get('/', async (req, res) => {
	try {
		const govdata = await new Promise((resolve, reject) => {
			child_process.exec('dash-cli getgovernanceinfo', (err, result) => {
				if (err)
					reject(err)
				else
					resolve(result)
			})
		})
		res.send(dataToResponseJSON(govdata, req))
	} catch(e) {
		let humanReadable = {
			command: e.cmd,
			message: e.toString().replace(/\n/g, '; ')
		};
		res.send(dataToResponseJSON(humanReadable, req))
	}
})

function dataToResponseJSON(data, req) {
	// Don't trust strings, formatting may look different
	if (typeof data === 'string')
		data = JSON.parse(data)

	let formatted = JSON.stringify(data, null, 4)

	// Make response readable in browser
	if (req.headers['user-agent'])
		formatted = '<pre>' + formatted + '</pre>'

	return formatted
}

app.listen(3000, () => {
	console.log('Example app listening on port 3000!')
})