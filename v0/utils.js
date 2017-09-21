const jwt = require('jsonwebtoken')
const Hashids = require('hashids')

const hashids = new Hashids(process.env.HASHID_SALT, 6)

module.exports.getFullUrl = req => {
	return req.protocol + '://' + req.get('host') + req.originalUrl.replace(/\/$/, '')
}

module.exports.validateSchema = async (schema, data) => {
	try {
		await schema.validate(data)
	} catch (err) {
		// if it's a validation error, return errors array
		if (err.errors) {
			return err.errors
		} else {
			throw err
		}
	}
}

module.exports.signJwt = (payload, options) => {
	return new Promise((resolve, reject) => {
		jwt.sign(
			payload,
			process.env.JWT_SECRET,
			Object.assign({}, options, { algorithm: 'HS256' }),
			(err, token) => {
				if (err) return reject(err)
				resolve(token)
			}
		)
	})
}

module.exports.verifyJwt = token => {
	return new Promise((resolve, reject) => {
		jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
			if (err) return reject(err)
			resolve(decoded)
		})
	})
}

module.exports.encodeId = id => {
	return hashids.encode(id)
}

module.exports.decodeId = id => {
	// hashids always returns and array in case multiple were encoded
	return hashids.decode(id)[0]
}
