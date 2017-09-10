const getDbDriver = require('../getDbDriver')

module.exports.up = async () => {
	const db = await getDbDriver()
	return db.schema.createTable('users', t => {
		t.increments('id')
		t.timestamp('createdAt').notNullable()
		t.timestamp('updatedAt').notNullable()
		t
			.string('username')
			.unique()
			.notNullable()
		t.string('password').notNullable()
		t.string('email').unique()
		t.string('emailConfirmationToken').unique()
		t.boolean('emailConfirmed')
		t.string('passwordResetToken').unique()
	})
}

module.exports.down = async () => {
	const db = await getDbDriver()
	return db.schema.dropTable('users')
}
