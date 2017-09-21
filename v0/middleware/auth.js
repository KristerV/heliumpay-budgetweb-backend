const { UnauthorizedError } = require('../errors')
const { verifyJwt } = require('../utils')
const scopes = require('../scopes')

module.exports = function createAuthMiddleware(allowedScopes) {
	if (typeof allowedScopes === 'string') {
		allowedScopes = [allowedScopes]
	}

	const hasValidScopes = scopes => scopes.every(s => allowedScopes.indexOf(s) === -1)

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
			const scopes = typeof decoded.scopes === 'string' ? [decoded.scopes] : decoded.scopes
			// token should contain a scope and be one of allowed scopes
			if (!scopes || !scopes.length) throw new Error('missing scope')
			if (hasValidScopes(scopes)) throw new Error('invalid scope')

			req.token = decoded
			next()
		} catch (err) {
			throw new UnauthorizedError(err.message)
		}
	}
}
