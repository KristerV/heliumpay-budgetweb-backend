const test = require('ava')
const request = require('supertest')
require('../../../setupTests.js')(test)

const app = require('../../../index.js')
const { User } = require('../../../database/models')
const { NotFoundError, UnauthorizedError } = require('../../errors')
const { signJwt } = require('../../utils')
const scopes = require('../../scopes')

const confirmEmailEndpoint = '/v0/users/:id/confirmEmail'

async function makeRequest(token, id) {
	const req = request(app).post(confirmEmailEndpoint.replace(':id', id))
	if (token) {
		req.set('Authorization', `Bearer ${token}`)
	}
	return req
}

test(`POST ${confirmEmailEndpoint} should not accept invalid auth token`, async t => {
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
		signJwt({ scopes: 'invalid' }, { subject: `${user.id}`, expiresIn: '10h' })
	])
	const invalidTokens = [null, 'invalid', expiredToken, ...invalidScopeTokens]

	for (const token of invalidTokens) {
		const { status, body } = await makeRequest(token, user.id)

		t.is(status, UnauthorizedError.CODE, body.message)
		t.is(body.code, UnauthorizedError.CODE)
		t.truthy(body.message)
	}
})

test(`POST ${confirmEmailEndpoint} should update confirmed email for user`, async t => {
	const user = await User.create({
		username: 'test',
		password: '123456',
		email: 'test@test.com',
		emailConfirmed: false
	})

	const token = await signJwt({ scopes: scopes.userConfirmEmail }, { subject: `${user.id}` })
	const { status, body } = await makeRequest(token, user.id)

	t.is(status, 200, body.message)
	t.truthy(body)
	t.true(typeof body.id === 'number')
	t.truthy(new Date(body.updatedAt) > new Date(body.createdAt))
	t.is(body.emailConfirmed, true)
})

test(`POST ${confirmEmailEndpoint} should not confirm email for another user`, async t => {
	const user = await User.create({
		username: 'test',
		password: '123456',
		email: 'test@test.com',
		emailConfirmed: false
	})

	const otherUser = await User.create({
		username: 'test-other',
		password: '123456',
		email: 'test-other@test.com',
		emailConfirmed: false
	})

	const token = await signJwt({ scopes: scopes.user }, { subject: `${user.id}` })
	const { status, body } = await makeRequest(token, otherUser.id)

	t.is(status, UnauthorizedError.CODE, body.message)
	t.is(body.code, UnauthorizedError.CODE)
	t.truthy(body.message)
})
