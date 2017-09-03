const request = require('supertest')
const app = require('../../../index.js')
const { User } = require('../../../database/models')
const { BadRequestError } = require('../../errors')
const registerUser = require('./registerUser')

const registerEndpoint = '/v0/register'

module.exports = test => {
	async function makeRequest(attrs) {
		const req = request(app).post(registerEndpoint)
		return req.send(attrs)
	}

	test(`POST ${registerEndpoint} should register user`, async t => {
		const validAttrs = [
			{ username: 'test1', password: '123456' },
			{ username: 'test2', password: '234567', email: 'test@test.com' }
		]

		for (const attrs of validAttrs) {
			const { status, body } = await makeRequest(attrs)

			t.is(status, 200, body.message)
			t.truthy(body)
			t.true(typeof body.id === 'number')
			t.truthy(new Date(body.createdAt))
			t.is(body.createdAt, body.updatedAt)
			t.is(body.username, attrs.username)
			t.is(body.email, attrs.email || null)
			t.is(body.emailConfirmed, false)
			// private fields, should never be returned by the endpoint
			t.false('emailConfirmationHash' in body)
			t.false('password' in body)
			// verify password was hashed
			const user = await User.findOne({ id: body.id })
			const matches = await User.comparePassword(user, attrs.password)
			t.truthy(matches)
		}
	})

	test(`POST ${registerEndpoint} should not register user with invalid attributes`, async t => {
		const invalidAttrs = [
			null,
			{},
			{ username: 'test1' },
			{ password: '123456' },
			{ username: 'test1', password: '12345' }
		]

		for (const attrs of invalidAttrs) {
			const { status, body } = await makeRequest(attrs)

			t.is(status, BadRequestError.CODE, body.message)
			t.is(body.code, BadRequestError.CODE)
			t.truthy(body.message)
		}
	})

	test(`POST ${registerEndpoint} should not register user with existing username`, async t => {
		await User.create({ username: 'test', password: '123456' })

		const attrs = { username: 'test', password: '123456' }
		const { status, body } = await makeRequest(attrs)

		t.is(status, BadRequestError.CODE, body.message)
		t.is(body.code, BadRequestError.CODE)
		t.truthy(body.message)
	})

	test(`POST ${registerEndpoint} should not register user with existing email`, async t => {
		await User.create({ username: 'test1', password: '123456', email: 'test@test.com' })

		const attrs = { username: 'test2', password: '123456', email: 'test@test.com' }
		const { status, body } = await makeRequest(attrs)

		t.is(status, BadRequestError.CODE, body.message)
		t.is(body.code, BadRequestError.CODE)
		t.truthy(body.message)
	})
}
