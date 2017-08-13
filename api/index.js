var fs = require('fs');

module.exports = function(app){
	fs.readdirSync(__dirname).forEach(function(file) {
		if (['index.js', 'utils.js'].includes(file) || file.split('.').slice(-1)[0] !== 'js')
			return;
		var name = file.substr(0, file.indexOf('.'));
		console.log(name)
		require('./' + name)(app);
	});
}