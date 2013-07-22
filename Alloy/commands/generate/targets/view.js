var GU = require('../generateUtils'),
	logger = require('../../../logger');

module.exports = function(name, args, program) {
	var info = GU.generate(name, 'VIEW', program);
	logger.info('Generated view named ' + name);
	require('./style')(name, args, program);
};
