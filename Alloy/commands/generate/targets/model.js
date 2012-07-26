var path = require('path'),
	fs = require('fs'),
	GU = require('../generateUtils'),
	U = require('../../../utils'),
	_ = require('../../../lib/alloy/underscore')._,
	CONST = require('../../../common/constants'),
	logger = require('../../../common/logger');

module.exports = function(name, args, program) {
	var type = 'MODEL';
	var basename = path.basename(name,'.'+CONST.FILE_EXT.MODEL);

	// validate arguments and paths
	if (args.length === 0) {
		U.die(
			'You need to specify columns for your model.\n' +
			'   `alloy generate model MODEL_NAME COL1:COL_TYPE COL2:COL_TYPE ...`'
		);
	}

	// generate model file
	var info = GU.generate(name, type, program, {
		template: { name: basename },
		templateFunc: function(contents) {
			var json = JSON.parse(contents);
			if (!json.columns) { json.columns = []; }
			_.each(args, function(pair) {
				var arr = pair.split(':');
				json.columns[arr[0]] = arr[1];
			});
			return U.stringifyJSON(json);
		}
	});
	logger.info('Generated ' + type.toLowerCase() + ' named ' + name);

	// generate (optional) custom code file for model
	// TODO: move to template
	var code = '(function(Model) {\n' +
			   '\t// add code to modify/extend your Model definition\n\n' +
			   '\t// Example:\n' +
			   '\t//   return Model.extend({\n' +
			   '\t//       customProperty: 123,\n' +
			   '\t//       customFunction: function() {}\n' +
			   '\t//   });\n\n' +
			   '\treturn Model;\n' + 
			   '})';
	fs.writeFileSync(path.join(program.outputPath,CONST.DIR.MODEL,name+'.js'),code);

	// generate associated migration
	var template = { up: '', down: '' };
	var migrationCode = info.code.split("\n");
	template.up = '\tdb.createTable("' + basename + '",\n';
	_.each(migrationCode, function(line) {
		template.up += '\t\t' + line + '\n';
	});
	template.up += '\t);';
	template.down = '\tdb.dropTable("' + basename + '");';

	// run the migration generator with the template
	(require('./migration'))(name, args, program, template);
}