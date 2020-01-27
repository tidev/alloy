const { logger} = require('alloy-utils');

var GU = require('../generateUtils');

module.exports = function(name, args, program) {
	var info = GU.generate(name, 'VIEW', program);
	logger.info('Generated view named ' + name);
	require('./style')(name, args, program);
};
