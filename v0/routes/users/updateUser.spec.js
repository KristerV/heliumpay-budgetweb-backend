const request = require('supertest')
const app = require('../../../index.js')
const { User } = require('../../../database/models')
const { UnauthorizedError, BadRequestError, NotFoundError } = require('../../errors')
const { signJwt } = require('../../utils')

const updateEndpoint = '/v0/users/:id'

module.exports = test => {
	async function makeRequest(token, id, attrs) {
		const req = request(app).put(updateEndpoint.replace(':id', id))
		if (token) {
			req.set('Authorization', `Bearer ${token}`)
		}
		return req.send(attrs)
	}

	test(`PUT ${updateEndpoint} should require valid auth token`, async t => {
		const expiredToken = await signJwt(
			// backdate token 2 seconds
			{ iat: Math.floor(Date.now() / 1000) - 2 },
			// set token to expire in 1 second
			{ expiresIn: '1s' }
		)
		const invalidTokens = [null, 'invalid', expiredToken]

		for (const token of invalidTokens) {
			const { status, body } = await makeRequest(token)

			t.is(status, UnauthorizedError.CODE, body.message)
			t.is(body.code, UnauthorizedError.CODE)
			t.truthy(body.message)
		}
	})

	test(`PUT ${updateEndpoint} should update user`, async t => {
		const user = await User.create({
			username: 'test',
			password: '123456',
			email: 'test@test.com',
			emailConfirmed: false
		})

		const validAttrs = [
			{ password: 'updated1' },
			{ password: 'updated2', email: 'updated@test.com' }
		]

		const token = await signJwt({}, { subject: String(user.id) })

		for (const attrs of validAttrs) {
			const { status, body } = await makeRequest(token, user.id, attrs)

			t.is(status, 200, body.message)
			t.truthy(body)
			t.true(typeof body.id === 'number')
			t.truthy(new Date(body.createdAt))
			t.truthy(new Date(body.updatedAt) > new Date(body.createdAt))
			// cannot update username
			t.is(body.username, user.username)
			t.is(body.email, attrs.email || user.email)
			t.is(body.emailConfirmed, false)
			// private fields, should never be returned by the endpoint
			t.false('emailConfirmationToken' in body)
			t.false('passwordResetToken' in body)
			t.false('password' in body)
			// verify password was hashed
			const updatedUser = await User.findOne({ id: body.id })
			const matches = await User.comparePassword(updatedUser, attrs.password)
			t.truthy(matches)
		}
	})

	test(`PUT ${updateEndpoint} should send confirmation for changed email`, async t => {
		const user = await User.create({
			username: 'test',
			password: '123456',
			email: 'test@test.com',
			emailConfirmed: false
		})

		const attrs = { email: 'updated@test.com' }
		const token = await signJwt({}, { subject: String(user.id) })
		const { status, body } = await makeRequest(token, user.id, attrs)

		t.is(status, 200, body.message)
		// verify email confirmation token was created
		const updatedUser = await User.findOne({ id: body.id })
		t.truthy(updatedUser.emailConfirmationToken)
		// TODO: verify email was sent using test mailer
	})

	test(`PUT ${updateEndpoint} should not update user with invalid attributes`, async t => {
		const user = await User.create({
			username: 'test',
			password: '123456',
			email: 'test@test.com',
			emailConfirmed: false
		})

		const invalidAttrs = [
			{ username: 'updated' }, // should not update username
			{ password: '12345' }, // invalid password
			{ email: 'invalid' } // invalid email
		]

		const token = await signJwt({}, { subject: String(user.id) })

		for (const attrs of invalidAttrs) {
			const { status, body } = await makeRequest(token, user.id, attrs)

			t.is(status, BadRequestError.CODE, JSON.stringify(attrs))
			t.is(body.code, BadRequestError.CODE)
			t.truthy(body.message)
		}
	})

	test(`PUT ${updateEndpoint} should not send confirmation for unchanged email`, async t => {
		const user = await User.create({
			username: 'test',
			password: '123456',
			email: 'test@test.com',
			emailConfirmed: false
		})

		const attrs = { email: 'test@test.com' }
		const token = await signJwt({}, { subject: String(user.id) })
		const { status, body } = await makeRequest(token, user.id, attrs)

		t.is(status, 200, body.message)
		const updatedUser = await User.findOne({ id: body.id })
		t.falsy(updatedUser.emailConfirmationToken)
	})

	test(`PUT ${updateEndpoint} should not update user to existing username`, async t => {
		// NOTE: this test is redundant because we are currently preventing users from
		// updating their username. we are including it for completeness should we decide
		// to allow users to update their username in the future
		const user1 = await User.create({
			username: 'test1',
			password: '123456',
			email: 'test1@test.com',
			emailConfirmed: false
		})

		const user2 = await User.create({
			username: 'test2',
			password: '123456',
			email: 'test2@test.com',
			emailConfirmed: false
		})

		const attrs = { username: 'test1' }
		const token = await signJwt({}, { subject: String(user2.id) })
		const { status, body } = await makeRequest(token, user2.id, attrs)

		t.is(status, BadRequestError.CODE, body.message)
		t.is(body.code, BadRequestError.CODE)
		t.truthy(body.message)
	})

	test(`PUT ${updateEndpoint} should not update user to existing email`, async t => {
		const user1 = await User.create({
			username: 'test1',
			password: '123456',
			email: 'test1@test.com',
			emailConfirmed: false
		})

		const user2 = await User.create({
			username: 'test2',
			password: '123456',
			email: 'test2@test.com',
			emailConfirmed: false
		})

		const attrs = { email: 'test1@test.com' }
		const token = await signJwt({}, { subject: String(user2.id) })
		const { status, body } = await makeRequest(token, user2.id, attrs)

		t.is(status, BadRequestError.CODE, body.message)
		t.is(body.code, BadRequestError.CODE)
		t.truthy(body.message)
	})
}
