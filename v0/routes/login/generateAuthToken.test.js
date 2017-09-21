const test = require('ava')
const request = require('supertest')
require('../../../setupTests.js')(test)

const app = require('../../../index.js')
const { User } = require('../../../database/models')
const { BadRequestError, UnauthorizedError } = require('../../errors')
const { verifyJwt, decodeId } = require('../../utils')
const scopes = require('../../scopes')
const generateAuthToken = require('./generateAuthToken')

const loginEndpoint = '/v0/login'

async function makeRequest(attrs) {
	const req = request(app).post(loginEndpoint)
	return req.send(attrs)
}

test(`POST ${loginEndpoint} should generate an auth token`, async t => {
	const user = await User.create({
		username: 'test',
		email: 'test@test.com',
		password: '123456'
	})

	const validAttrs = [
		{ username: 'test', password: '123456' },
		{ email: 'test@test.com', password: '123456' }
	]

	for (const attrs of validAttrs) {
		const { status, body } = await makeRequest(attrs)

		t.is(status, 200, body.message)
		t.truthy(body)
		t.true(typeof body.token === 'string')
		// verify jwt
		const decoded = await verifyJwt(body.token)
		t.is(decodeId(decoded.sub), user.id)
		t.is(decoded.scopes, scopes.user)
		t.truthy(decoded.iat)
		t.truthy(decoded.exp)
	}
})

test(`POST ${loginEndpoint} should not generate an auth token for missing parameters`, async t => {
	const invalidAttrs = [
		null,
		{},
		{ username: 'test' },
		{ email: 'test@test.com' },
		{ username: 'test', email: 'test@test.com' },
		{ password: '123456' }
	]

	for (const attrs of invalidAttrs) {
		const { status, body } = await makeRequest(attrs)

		t.is(status, BadRequestError.CODE, body.message)
		t.is(body.code, BadRequestError.CODE)
		t.truthy(body.message)
	}
})

test(`POST ${loginEndpoint} should not generate an auth token for invalid credentials`, async t => {
	const user = await User.create({
		username: 'test',
		email: 'test@test.com',
		password: '123456'
	})

	const invalidAttrs = [
		{ username: 'test', password: 'wrong' },
		{ email: 'test@test.com', password: 'wrong' },
		{ username: 'wrong', password: '123456' },
		{ email: 'wrong', password: '123456' }
	]

	for (const attrs of invalidAttrs) {
		const { status, body } = await makeRequest(attrs)

		t.is(status, UnauthorizedError.CODE, body.message)
		t.is(body.code, UnauthorizedError.CODE)
		t.truthy(body.message)
	}
})
