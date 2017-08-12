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
		res.send(JSON.stringify(govdata))
	} catch(e) {
		let humanReadable = {
			cmd: e.cmd,
			message: e.toString()
		};
		res.send(JSON.stringify(humanReadable, null, 4))
	}
})

app.listen(3000, () => {
	console.log('Example app listening on port 3000!')
})