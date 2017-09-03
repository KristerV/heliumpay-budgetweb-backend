const request = require('supertest')
const { BadRequestError } = require('../../errors')
const registerUser = require('./registerUser')

const registerEndpoint = '/v0/register'

module.exports = test => {
	async function makeRequest(app, attrs) {
		const req = request(app).post(registerEndpoint)
		return req.send(attrs)
	}

	test(`${registerEndpoint} should register user`, async t => {
		const { app } = t.context

		const validAttrs = [
			{ username: 'test1', password: '123456' },
			{ username: 'test2', password: '123456', email: 'test@test.com' }
		]

		for (const attrs of validAttrs) {
			const { status, body } = await makeRequest(app, attrs)

			t.is(status, 200, body.message)
			t.truthy(body)
			t.true(typeof body.id === 'number')
			t.truthy(new Date(body.createdAt))
			t.is(body.createdAt, body.updatedAt)
			t.is(body.username, attrs.username)
			t.is(body.email, attrs.email || null)
			t.is(body.emailConfirmed, false)
			// private fields, should never be returned by api endpoint
			t.is(body.emailConfirmationHash, undefined)
			t.is(body.password, undefined)
		}
	})

	test(`${registerEndpoint} should not register user with invalid attributes`, async t => {
		const { app } = t.context

		const invalidAttrs = [
			null,
			{},
			{ username: 'test1' },
			{ password: '123456' },
			{ username: 'test1', password: '12345' }
		]

		for (const attrs of invalidAttrs) {
			const { status, body } = await makeRequest(app, attrs)

			t.is(status, BadRequestError.CODE, body.message)
			t.is(body.code, BadRequestError.CODE)
			t.truthy(body.message)
		}
	})
}
