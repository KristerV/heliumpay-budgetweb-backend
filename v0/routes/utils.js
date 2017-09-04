const jwt = require('jsonwebtoken')

module.exports.getValidationErrors = async (schema, data) => {
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
