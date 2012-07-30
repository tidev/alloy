var GU = require('../generateUtils'),
	logger = require('../../../common/logger');

module.exports = function(name, args, program) {
	var types = ['VIEW','STYLE'];
	for (var i = 0; i < types.length; i++) {
		var type = types[i];
		var info = GU.generate(name, type, program);
		logger.info('Generated ' + type.toLowerCase() + ' named ' + name);
	}
}