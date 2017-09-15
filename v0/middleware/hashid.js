const { encodeId, decodeId } = require('../utils')

const isObjectWithId = value => value && typeof value === 'object' && 'id' in value

module.exports = function createHashIdMiddleware() {
	return function hashIdMiddleware(req, res, next) {
		// decode id in request parameters
		if (req.params && req.params.id) {
			req.params.id = decodeId(req.params.id)
		}

		// decode id in request token
		if (req.token && req.token.sub) {
			req.token.sub = decodeId(req.token.sub)
		}

		// override res.json to return hash ids
		const oldJson = res.json.bind(res)

		res.json = body => {
			if (Array.isArray(body) && isObjectWithId(body[0])) {
				// body is a collection of objects with ids, send a new array with encoded ids
				body = body.map(value => {
					value.id = encodeId(value.id)
					return value
				})
			} else if (isObjectWithId(body)) {
				body.id = encodeId(body.id)
			}

			oldJson(body)
		}
		next()
	}
}
