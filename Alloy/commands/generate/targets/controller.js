const { logger} = require('alloy-utils');

var GU = require('../generateUtils');

module.exports = function(name, args, program) {
	var type = 'CONTROLLER';
	var info = GU.generate(name, type, program);
	require('./view')(name, args, program);
	logger.info('Generated view-style-controller named ' + name);
};
