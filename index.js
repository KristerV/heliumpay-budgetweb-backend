const child_process = require('child_process')
const express = require('express')
const app = express()

app.get('/', async (req, res) => {
	const govdata = await new Promise((resolve, reject) => {
		child_process.exec('dash-cli getgovernanceinfo', (err, result) => {
			if (err)
				reject(err)
			else
				resolve(result)
		})
	}).catch((e) => {
		res.send(e)
	})
	res.send(JSON.stringify(govdata))
})

app.listen(3000, () => {
	console.log('Example app listening on port 3000!')
})