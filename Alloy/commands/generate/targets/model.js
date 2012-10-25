var path = require('path'),
	fs = require('fs'),
	wrench = require('wrench'),
	U = require('../../../utils'),
	_ = require('../../../lib/alloy/underscore')._,
	logger = require('../../../common/logger'),
	alloyRoot = path.join(__dirname,'..','..','..'),
	MODELCODETEMPLATE_FILE = path.join(alloyRoot, 'template', 'modelcode.js');

module.exports = function(name, args, program) {
	var modelTemplateFile = MODELCODETEMPLATE_FILE,
		adapter = 'localDefault',
		paths = U.getAndValidateProjectPaths(program.outputPath || program.projectDir);
    
	// validate arguments and paths
	if (args.length >= 1) {
		adapter = args[0];
	}

	if ((adapter === 'sql' && args.length === 1) || (adapter === 'localDefault' && (args.length === 1 || args.length === 0))) {
		U.die(
			'You need to specify columns for your model.\n' +
			'   `alloy generate model MODEL_NAME COL1:COL_TYPE COL2:COL_TYPE ...`'
		);
	}

    var schema = "";
    var columns = "";
	_.each(args, function(pair) {
		if (pair.indexOf(':') != -1) {
			var arr = pair.split(':');
			schema += '\t\t\t"'+arr[0]+'":"'+arr[1]+'",\n';
		}
	});

    // added header and footer and remove last comma and new line
	if (schema.indexOf(':') != -1) {
		columns = '\t\t"columns": {\n'+schema.substring(0, schema.length - 2)+'\n\t\t},'
	} 

	// generate model code based on model.js template and migrations
	var code = _.template(fs.readFileSync(modelTemplateFile, 'utf8'), {
		adapter: adapter,
		name: name,
		schema: columns
	});	

	wrench.mkdirSyncRecursive(path.join(paths.app,'models'));
	var file = path.join(paths.app,'models', name+'.js');
    fs.writeFileSync(file, code);
	
	logger.info('Generated model description named ' + name);

    if (adapter != 'sql' && adapter != 'localDefault') {
    	return; // done - migrations not needed
    }

	// generate associated migration
	var template = { up: '', down: '' };
	var migrationCode = columns.split("\n");
	template.up = '\tdb.createTable({\n';
	_.each(migrationCode, function(line) {
		template.up +=  line+'\n';
	});
	template.up += '\t\t"adapter": {\n\t\t\t"type": "'+adapter+'",\n\t\t\t"collection_name": "'+name+'"\n\t\t}\n'
	template.up += '\t});';
	template.down = '\tdb.dropTable("' + name + '");';

	// run the migration generator with the template
	(require('./migration'))(name, args, program, template);
}