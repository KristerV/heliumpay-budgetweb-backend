module.exports = function(name, code) {
	class HttpError extends Error {
		constructor(message) {
			super(message)

			// error details
			this.name = name
			this.message = message
			this.code = code

			// add stack trace to error object
			Error.captureStackTrace(this, this.constructor)
		}
	}

	// static constant used for tests
	HttpError.CODE = code

	return HttpError
}
