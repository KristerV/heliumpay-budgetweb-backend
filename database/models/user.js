const getDbDriver = require('../getDbDriver')
const { createTimestamps, updateTimestamps, withTransaction } = require('./utils')

/**
 * User Model
 * @module User
 */

const table = 'users'

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
 * User.create creates a new user
 * @param {UserAttributes} attrs - The attributes of the user to create
 * @param {*=} trx - The optional transaction context
 * @return {User} - The newly created user
 */
module.exports.create = async function create(attrs, trx) {
	const db = await getDbDriver()
	// TODO: bcrypt attrs.password
	const [user] = await withTransaction(trx, db(table).insert(createTimestamps(attrs), '*'))

	return user
}

/**
 * User.update updates an existing user
 * @param {number} id - The id of the user to update
 * @param {UserAttributes} attrs - The attributes of the user to update
 * @param {*=} trx - The optional transaction context
 * @return {User} - The updated user
 */
module.exports.update = async function update(id, attrs, trx) {
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
 * User.findOne finds an existing user that matches the provided attributes
 * @param {UserAttributes} attrs - The attributes of the user to match against
 * @return {?User} - The matched user, null if not found
 */
module.exports.findOne = async function findOne(attrs) {
	const db = await getDbDriver()
	const user = await db
		.first()
		.from('users')
		.where(attrs)

	return user
}

/**
 * User.findAll finds all existing user that match the provided attributes
 * @param {UserAttributes} attrs - The attributes of the user to match against
 * @return {User[]} - The matched users
 */
module.exports.findAll = async function findAll(attrs) {
	const db = await getDbDriver()
	const user = await db
		.select()
		.from('users')
		.where(attrs)

	return user
}
