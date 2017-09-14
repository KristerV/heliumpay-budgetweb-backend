const createMailgunClient = require('mailgun-js')

let mailgun

module.exports = function getClient() {
	if (!mailgun && process.env.MAILGUN_API_KEY && process.env.MAILGUN_DOMAIN) {
		mailgun = createMailgunClient({
			apiKey: process.env.MAILGUN_API_KEY,
			domain: process.env.MAILGUN_DOMAIN
		})
	}

	return {
		send: async message => {
			return new Promise((resolve, reject) => {
				if (!mailgun) {
					throw new Error(
						'mailgun not initialized, check MAILGUN_API_KEY and MAILGUN_DOMAIN environment variables.'
					)
				}
				mailgun.messages().send(message, err => {
					if (err) return reject(err)
					resolve()
				})
			})
		}
	}
}
