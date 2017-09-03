const omit = require('lodash.omit')
const getDbDriver = require('../getDbDriver')
const { createTimestamps, updateTimestamps, withTransaction } = require('./utils')

/**
 * User Model
 * @module User
 */

const table = 'users'
const privateFields = ['password', 'emailConfirmationHash']

/**
 * @typedef User
 * @type {object}
 * @property {string} id - the user's id
 * @property {string} username - the user's username
 * @property {string} password - the user's password (will be automatically hashed)
 * @property {string} email - the user's email
 * @property {string} emailConfirmationHash - the hash of the confirmation email
 * @property {string} emailConfirmed - whether or not the user's email address has been confirmed
 * @property {string} createdAt - the date the user was created
 * @property {string} updatedAt - the date the user was last updated
 */

/**
 * @typedef UserAttributes
 * @type {object}
 * @property {string} username
 * @property {string} password
 * @property {string} email
 * @property {string} emailConfirmationHash
 * @property {string} emailConfirmed
 */

/**
 * @function create - creates a new user
 * @param {UserAttributes} attrs - The attributes of the user to create
 * @param {*=} trx - The optional transaction context
 * @return {Promise.<User>} - The newly created user
 */
module.exports.create = async (attrs, trx) => {
	const db = await getDbDriver()
	// TODO: bcrypt attrs.password
	const [user] = await withTransaction(trx, db(table).insert(createTimestamps(attrs), '*'))

	return user
}

/**
 * @function update - updates an existing user
 * @param {number} id - The id of the user to update
 * @param {UserAttributes} attrs - The attributes of the user to update
 * @param {*=} trx - The optional transaction context
 * @return {Promise.<User>} - The updated user
 */
module.exports.update = async (id, attrs, trx) => {
	const db = await getDbDriver()
	// TODO: bcrypt attrs.password if provided
	const [user] = await withTransaction(
		trx,
		db(table)
			.where('id', id)
			.update(updateTimestamps(attrs), '*')
	)

	return user
}

/**
 * @function findOne - finds an existing user that matches the provided attributes
 * @param {UserAttributes} attrs - The attributes of the user to match against
 * @return {Promise.<?User>} - The matched user, null if not found
 */
module.exports.findOne = async attrs => {
	const db = await getDbDriver()
	const user = await db
		.first()
		.from('users')
		.where(attrs)

	return user
}

/**
 * @function findAll - finds all existing user that match the provided attributes
 * @param {UserAttributes} attrs - The attributes of the user to match against
 * @return {Promise.<User[]>} - The matched users
 */
module.exports.findAll = async attrs => {
	const db = await getDbDriver()
	const user = await db
		.select()
		.from('users')
		.where(attrs)

	return user
}

/**
 * @function stripPrivateFields - strips private fields from a user object
 * @param {User} user - The user
 * @return {UserPublic} - The user without private fields
 */
module.exports.stripPrivateFields = user => {
	return omit(user, privateFields)
}
