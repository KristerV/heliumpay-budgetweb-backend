const test = require('ava')
const request = require('supertest')
const sinon = require('sinon')
require('../../../setupTests.js')(test)

const app = require('../../../index.js')
const { User } = require('../../../database/models')
const { NotFoundError, BadRequestError } = require('../../errors')

const sendEndpoint = '/v0/login/sendPasswordResetEmail'

async function makeRequest(attrs) {
	const req = request(app).post(sendEndpoint)
	return req.send(attrs)
}

test(`POST ${sendEndpoint} should send password reset email`, async t => {
	const user = await User.create({
		username: 'test',
		password: '123456',
		email: 'test@jschr.io',
		emailConfirmed: false
	})

	const sendPasswordReset = sinon.spy(t.context.mailer, 'sendPasswordReset')
	const { status, body } = await makeRequest({ email: user.email })

	t.is(status, 200, body.message)
	t.is(body, true)
	// verify email was sent using test mailer
	t.truthy(sendPasswordReset.called)
})

test(`POST ${sendEndpoint} should not send password reset email for invalid attributes`, async t => {
	const { status, body } = await makeRequest()

	t.is(status, BadRequestError.CODE, body.message)
	t.is(body.code, BadRequestError.CODE)
	t.truthy(body.message)
})

test(`POST ${sendEndpoint} should not send password reset email for non-existent email`, async t => {
	const { status, body } = await makeRequest({ email: 'invalid@test.com' })

	t.is(status, NotFoundError.CODE, body.message)
	t.is(body.code, NotFoundError.CODE)
	t.truthy(body.message)
})
