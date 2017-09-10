const request = require('supertest')
const app = require('../../../index.js')
const { User } = require('../../../database/models')
const { UnauthorizedError, NotFoundError } = require('../../errors')
const { signJwt } = require('../../utils')
const scopes = require('../../scopes')

const selfEndpoint = '/v0/users/:id'

module.exports = test => {
	async function makeRequest(token, id) {
		const req = request(app).get(selfEndpoint.replace(':id', id))
		if (token) {
			req.set('Authorization', `Bearer ${token}`)
		}
		return req
	}

	test(`GET ${selfEndpoint} should require valid auth token`, async t => {
		const user = await User.create({
			username: 'test',
			password: '123456',
			email: 'test@test.com',
			emailConfirmed: false
		})

		const expiredToken = await signJwt(
			// backdate token 2 seconds
			{ iat: Math.floor(Date.now() / 1000) - 2 },
			// set token to expire in 1 second
			{ expiresIn: '1s' }
		)
		const invalidScopeTokens = await Promise.all([
			signJwt({ scopes: [] }, { subject: `${user.id}`, expiresIn: '10h' }),
			signJwt({ scopes: 'invalid2' }, { subject: `${user.id}`, expiresIn: '10h' })
		])
		const invalidTokens = [null, 'invalid', expiredToken, ...invalidScopeTokens]

		for (const token of invalidTokens) {
			const { status, body } = await makeRequest(token, user.id)

			t.is(status, UnauthorizedError.CODE, body.message)
			t.is(body.code, UnauthorizedError.CODE)
			t.truthy(body.message)
		}
	})

	test(`GET ${selfEndpoint} should get profile of authenticated user`, async t => {
		const user = await User.create({
			username: 'test',
			password: '123456',
			email: 'test@test.com',
			emailConfirmed: false
		})

		const token = await signJwt({ scopes: scopes.user }, { subject: `${user.id}` })
		const { status, body } = await makeRequest(token, user.id)

		t.is(status, 200, body.message)
		t.truthy(body)
		t.true(typeof body.id === 'number')
		t.truthy(new Date(body.createdAt))
		t.is(body.createdAt, body.updatedAt)
		t.is(body.username, user.username)
		t.is(body.email, user.email)
		t.is(body.emailConfirmed, false)
		// private fields, should never be returned by the endpoint
		t.false('password' in body)
	})

	test(`GET ${selfEndpoint} should not get profile of another user`, async t => {
		const user = await User.create({
			username: 'test',
			password: '123456',
			email: 'test@test.com',
			emailConfirmed: false
		})

		const token = await signJwt({ scopes: scopes.user }, { subject: '2' })
		const { status, body } = await makeRequest(token, user.id)

		t.is(status, UnauthorizedError.CODE, body.message)
		t.is(body.code, UnauthorizedError.CODE)
		t.truthy(body.message)
	})

	test(`GET ${selfEndpoint} should not get profile of non-existent user`, async t => {
		const token = await signJwt({ scopes: scopes.user }, { subject: '9999' })
		const { status, body } = await makeRequest(token, '9999')

		t.is(status, NotFoundError.CODE, body.message)
		t.is(body.code, NotFoundError.CODE)
		t.truthy(body.message)
	})
}
