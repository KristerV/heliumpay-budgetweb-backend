const test = require('ava')
const request = require('supertest')
const sinon = require('sinon')
require('../../../setupTests.js')(test)

const app = require('../../../index.js')
const { User } = require('../../../database/models')
const { BadRequestError } = require('../../errors')

const createEndpoint = '/v0/users'

async function makeRequest(attrs) {
	const req = request(app).post(createEndpoint)
	return req.send(attrs)
}

test(`POST ${createEndpoint} should create user`, async t => {
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
		t.false('password' in body)
		// verify password was hashed
		const user = await User.findOne({ id: body.id })
		const matches = await User.comparePassword(user, attrs.password)
		t.truthy(matches)
	}
})

test(`POST ${createEndpoint} should verify email`, async t => {
	const attrs = { username: 'test2', password: '234567', email: 'test@test.com' }
	const sendEmailConfirmation = sinon.spy(t.context.mailer, 'sendEmailConfirmation')
	const { status, body } = await makeRequest(attrs)

	t.is(status, 200, body.message)
	t.truthy(sendEmailConfirmation.called)
})

test(`POST ${createEndpoint} should not create user with invalid attributes`, async t => {
	const invalidAttrs = [
		null,
		{},
		{ username: 'test' }, // missing password
		{ password: '123456' }, // missing username
		{ username: 'test', password: '12345' }, // invalid password
		{ email: 'test@test.com', password: '123456' }, // missing username
		{ username: 'test', password: '123456', email: 'invalid' } // invalid email
	]

	for (const attrs of invalidAttrs) {
		const { status, body } = await makeRequest(attrs)

		t.is(status, BadRequestError.CODE, body.message)
		t.is(body.code, BadRequestError.CODE)
		t.truthy(body.message)
	}
})

test(`POST ${createEndpoint} should not create with internal fields`, async t => {
	const attrs = {
		username: 'test',
		password: '123456',
		email: 'test@test.com',
		emailConfirmationToken: 'token',
		passwordResetToken: 'token'
	}
	const { status, body } = await makeRequest(attrs)

	t.is(status, 200, body.message)
	const user = await User.findOne({ id: body.id })
	t.not(user.emailConfirmationToken, attrs.emailConfirmationToken)
	t.not(user.passwordResetToken, attrs.passwordResetToken)
})

test(`POST ${createEndpoint} should not create user with existing username`, async t => {
	await User.create({ username: 'test', password: '123456' })

	const attrs = { username: 'test', password: '123456' }
	const { status, body } = await makeRequest(attrs)

	t.is(status, BadRequestError.CODE, body.message)
	t.is(body.code, BadRequestError.CODE)
	t.truthy(body.message)
})

test(`POST ${createEndpoint} should not create user with existing email`, async t => {
	await User.create({ username: 'test1', password: '123456', email: 'test@test.com' })

	const attrs = { username: 'test2', password: '123456', email: 'test@test.com' }
	const { status, body } = await makeRequest(attrs)

	t.is(status, BadRequestError.CODE, body.message)
	t.is(body.code, BadRequestError.CODE)
	t.truthy(body.message)
})
