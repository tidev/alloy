var path = require('path'),
	fs = require('fs'),
	U = require('../../utils'),
	_ = require("../../lib/alloy/underscore")._,
	CONST = require('../../common/constants'),
	logger = require('../../common/logger');

module.exports = function(name, args, program) {
	var templatePath = path.join(__dirname,'..','..','template');
	var modelTemplatePath = path.join(templatePath, 'model.' + CONST.FILE_EXT.MODEL);
	var migrationTemplatePath = path.join(templatePath, 'migration.' + CONST.FILE_EXT.MIGRATION);
	var migrationsDir = path.join(program.outputPath,'migrations');
	var modelsDir = path.join(program.outputPath,'models');
	var template = {
		up: '',
		down: ''
	}
		
	// validate arguments and paths
	if (args.length === 0) {
		U.die(
			'You need to specify columns for your model.\n' +
			'   `alloy generate model MODEL_NAME COL1:COL_TYPE COL2:COL_TYPE ...`'
		);
	}
	U.ensureDir(migrationsDir);
	U.ensureDir(modelsDir);
	
	// Create model JSON from template and command line column arguments
	var modelJsonCode = _.template(fs.readFileSync(modelTemplatePath, 'utf8'), {name:name});
	var json = JSON.parse(modelJsonCode);
	_.each(args, function(pair) {
		var arr = pair.split(':');
		json.columns[arr[0]] = arr[1];
	});

	// Write new model JSON to model file
	var modelFile = path.join(modelsDir,name+'.' + CONST.FILE_EXT.MODEL);
	if (path.existsSync(modelFile) && !program.force) {
		U.die("Model file already exists: "+modelFile);
	}
	var code = U.stringifyJSON(json);
	fs.writeFileSync(modelFile, code);

	// generate migration file
	var migrationFile = path.join(migrationsDir, U.generateMigrationFileName(name));
	var migrationCode = code.split("\n");

	// Create the "up" and "down" template values
	template.up = '\tdb.createTable("' + name + '",\n';
	_.each(migrationCode, function(line) {
		template.up += '\t\t' + line + '\n';
	});
	template.up += '\t);';
	template.down = '\tdb.dropTable("' + name + '");'

	// Write out migration via template
	fs.writeFileSync(migrationFile, _.template(fs.readFileSync(migrationTemplatePath, 'utf8'), template));

	logger.info('Generated model named '+name);
}