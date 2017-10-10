const getDbDriver = require('../getDbDriver')

module.exports.up = async () => {
	const db = await getDbDriver()
	return db.schema.createTable('user', t => {
		t.increments('id')
		t.timestamp('createdAt').notNullable()
		t.timestamp('updatedAt').notNullable()
		t
			.string('username')
			.unique()
			.notNullable()
		t.string('password').notNullable()
		t.string('email').unique()
		t.boolean('emailConfirmed')
	})
}

module.exports.down = async () => {
	const db = await getDbDriver()
	return db.schema.dropTable('user')
}
