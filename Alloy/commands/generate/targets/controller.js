var path = require('path'),
	fs = require('fs'),
	U = require('../../../utils'),
	_ = require("../../../lib/alloy/underscore")._,
	CONST = require('../../../common/constants'),
	logger = require('../../../common/logger');

module.exports = function(name, args, program) {
	var templatePath = path.join(__dirname,'..','..','..','template','controller.' + CONST.FILE_EXT.CONTROLLER);
	var cn = path.join(program.outputPath,'controllers',name+'.'+CONST.FILE_EXT.CONTROLLER);
	
	if (path.existsSync(cn) && !program.force) {
		U.die("Controller file already exists: " + cn);
	}

	var code = _.template(fs.readFileSync(templatePath,'utf8'), {});
	fs.writeFileSync(cn, code);

	logger.info('Generated controller named '+name);
}