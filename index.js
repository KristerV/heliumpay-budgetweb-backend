const express = require('express')
const app = express()
const routerV0 = express.Router();
const requireAll = require('require-all')
const utilsV0 = require('./v0/utils')

// Create router for each version
const versions = ['v0']
let routers = [];
versions.forEach(v => {
	const router = express.Router()
	app.use('/'+v, router)
	routers.push(router)
})

// Find all routes.js files
const allRoutes = requireAll({
	dirname: __dirname,
	filter: /^routes\.js$/,
	excludeDirs: /^(\.git|node_modules)$/,
	recursive: true
});

// Import all routes
let allRoutesStrings = []
function importObject(obj, currentRoute) {
	const router = express.Router()
	app.use(currentRoute, router)
	for (const key in obj) {
		if (!obj.hasOwnProperty(key))
			continue
		if (typeof obj[key] === 'function') {
			obj[key](router) // Import
			allRoutesStrings.push(currentRoute) // Save for display
		} else
			importObject(obj[key], currentRoute + '/' + key) // Recurse
	}
}
importObject(allRoutes, '')

// Root response
app.get('/', async (req, res) => {
	const fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl.replace(/\/$/, '')
	let routesUrls = [];
	allRoutesStrings.forEach(r => routesUrls.push(fullUrl + r))
	const data = {"All available endpoints": routesUrls.sort()}
	res.send(utilsV0.formatResponse(data, req))
})

app.listen(3000, () => {
	console.log('Listening on port 3000!')
})