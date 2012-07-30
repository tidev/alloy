var GU = require('../generateUtils'),
	logger = require('../../../common/logger');

module.exports = function(name, args, program) {
	var type = 'CONTROLLER';
	var info = GU.generate(name, type, program);
	logger.info('Generated ' + type.toLowerCase() + ' named ' + name);
}