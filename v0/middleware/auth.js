const { UnauthorizedError } = require('../errors')
const { verifyJwt } = require('../utils')

module.exports = function createAuthMiddleware() {
	return async function authMiddleware(req, res, next) {
		const authHeader = req.headers && req.headers.authorization
		if (!authHeader) throw new UnauthorizedError('missing authorization header')

		const authHeaderParts = authHeader.split(' ')
		const strategy = authHeaderParts[0]
		const token = authHeaderParts[1]

		if (strategy !== 'Bearer' && !token)
			throw new UnauthorizedError('authorization header format should be `Bearer <JWT>`')

		try {
			const decoded = await verifyJwt(token)
			req.token = decoded
			next()
		} catch (err) {
			throw new UnauthorizedError(err.message)
		}
	}
}
