var GU = require('../generateUtils'),
	logger = require('../../../logger');

module.exports = function(name, args, program) {
	var type = 'STYLE';
	var info = GU.generate(name, type, program);
	if (info) {
		logger.info('Generated style named '+name);
	}
};
