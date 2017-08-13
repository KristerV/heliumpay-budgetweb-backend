
module.exports.formatResponse = function (data, req) {
	// Don't trust strings, formatting may look different
	if (typeof data === 'string')
		data = JSON.parse(data)

	let formatted = JSON.stringify(data, null, 4)

	// Make response readable in browser
	if (req && req.headers['user-agent']) {
		formatted = '<pre>' + formatted + '</pre>'
		formatted = formatted.replace(/"(https?:\/\/.*)"/g, '<a href="$1">$1</a>')
	}

	return formatted
}

module.exports.getFullUrl = (req) => {
	return req.protocol + '://' + req.get('host') + req.originalUrl.replace(/\/$/, '')
}