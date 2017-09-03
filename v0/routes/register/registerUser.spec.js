const registerUser = require('./registerUser')
const request = require('supertest')

const registerEndpoint = '/v0/register'

module.exports = test => {
	async function makeRequest(app, attrs) {
		const req = request(app).post(registerEndpoint)
		return req.send(attrs)
	}

	test(`${registerEndpoint} should register user`, async t => {
		const { app } = t.context
		const attrs = { username: 'test', password: 'test' }
		const { status, body } = await makeRequest(app, attrs)

		t.is(status, 200)
		t.truthy(body)
		t.is(body.id, 1)
		t.truthy(body.createdAt)
		t.is(body.createdAt, body.updatedAt)
		t.is(body.username, attrs.username)
		t.is(body.email, null)
		t.is(body.emailConfirmationHash, null)
		t.is(body.emailConfirmed, false)
	})
}
