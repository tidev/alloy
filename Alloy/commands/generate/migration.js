var path = require('path'),
	fs = require('fs'),
	U = require('../../utils'),
	_ = require("../../lib/alloy/underscore")._,
	logger = require('../../common/logger');

module.exports = function(name, args, program) {
	var migrationsDir = path.join(program.outputPath,'migrations');
	U.ensureDir(migrationsDir);
	
	var templatePath = path.join(__dirname,'..','..','template','migration.js');
	var mf = path.join(migrationsDir, U.generateMigrationFileName(name));
	var md = _.template(fs.readFileSync(templatePath,'utf8'),{});
	fs.writeFileSync(mf,md);

	logger.info('Generated empty migration named '+name);
}