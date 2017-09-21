const chalk = require('chalk')
const getDbDriver = require('../database/getDbDriver')

async function run() {
	const db = await getDbDriver()
	const results = await db.migrate.latest()
	const [batchNo, log] = results

	if (log.length === 0) {
		console.log(chalk.cyan('Database migrations already up to date.'))
	}

	console.log(
		chalk.green(`Batch ${batchNo} run: ${log.length} migrations \n`) +
			chalk.cyan(log.join('\n'))
	)
}

run()
	.then(() => process.exit())
	.catch(console.error)
