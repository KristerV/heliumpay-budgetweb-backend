const express = require('express')
const app = express()

require('./api')(app)

app.listen(3000, () => {
	console.log('Example app listening on port 3000!')
})