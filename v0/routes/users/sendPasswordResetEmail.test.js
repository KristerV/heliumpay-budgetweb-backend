const test = require('ava')
const request = require('supertest')
require('../../../setupTests.js')(test)

const app = require('../../../index.js')
const { User } = require('../../../database/models')
const { NotFoundError } = require('../../errors')

const sendEndpoint = '/v0/users/sendPasswordResetEmail'

async function makeRequest(attrs) {
	const req = request(app).post(sendEndpoint)
	return req.send(attrs)
}

test(`POST ${sendEndpoint} should send password reset email`, async t => {
	const user = await User.create({
		username: 'test',
		password: '123456',
		email: 'test@test.com',
		emailConfirmed: false
	})

	const { status, body } = await makeRequest({ email: 'test@test.com' })

	t.is(status, 200, body.message)
	t.is(body, true)

	// TODO: verify email was sent using test mailer
})

test(`POST ${sendEndpoint} should not send password reset email for non-existent email`, async t => {
	const { status, body } = await makeRequest({ email: 'invalid@test.com' })

	t.is(status, NotFoundError.CODE, body.message)
	t.is(body.code, NotFoundError.CODE)
	t.truthy(body.message)
})
