var path = require('path'),
	GU = require('../generateUtils'),
	CONST = require('../../../common/constants'),
	logger = require('../../../common/logger');

module.exports = function(name, args, program, template) {
	var type = 'MIGRATION';
	var dir = path.dirname(name);
	name = path.join(dir,
		GU.generateMigrationFileName(path.basename(name,'.'+CONST.FILE_EXT.MIGRATION)));
	var info = GU.generate(name, type, program, {
		template: template || {
			up:'',
			down:''
		}
	});
	logger.info('Generated ' + type.toLowerCase() + ' named ' + name);
}