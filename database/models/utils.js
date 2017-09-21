module.exports.createTimestamps = obj => {
	return Object.assign({}, obj, {
		createdAt: new Date(),
		updatedAt: new Date()
	})
}

module.exports.updateTimestamps = obj => {
	return Object.assign({}, obj, {
		updatedAt: new Date()
	})
}

module.exports.deleteTimestamps = obj => {
	return Object.assign({}, obj, {
		deletedAt: new Date()
	})
}

module.exports.withTransaction = (trx, query) => {
	return trx ? query.transacting(trx) : query
}
