var path = require('path'),
	fs = require('fs'),
	wrench = require('wrench'),
	U = require('../../../utils'),
	CONST = require('../../../common/constants'),
	_ = require('../../../lib/alloy/underscore')._,
	logger = require('../../../common/logger');

var ALLOY_ROOT = path.join(__dirname,'..','..','..'),
	MODEL_TEMPLATE = path.join(ALLOY_ROOT, 'template', 'modelcode.js'),
	VALID_ADAPTERS = ['sql','properties','localStorage'],
	USAGE = [
		'Usage:',
        '    alloy generate model NAME TYPE COLUMN1:TYPE COLUMN2:TYPE ...',
        'Examples:',
        '    alloy generate model people sql name:text age:integer',
        '    alloy generate model appState properties loggedIn:Bool items:List'
    ];

module.exports = function(name, args, program) {
	// validate project
	var paths = U.getAndValidateProjectPaths(program.outputPath || program.projectDir);

	// validate the list of arguments 
 	var adapter;
	if (args.length === 0) {
		U.die(['`alloy generate model` requires a type and list of columns', USAGE]);
	} else {
		adapter = args[0];
		if (!_.contains(VALID_ADAPTERS, adapter)) {
			U.die([
				'Invalid adapter type "' + adapter + '".',
				'Must be one of the following: [' + VALID_ADAPTERS.join(',') + ']',
				USAGE
			]);
		}
	}

	// create array of columns
	var columns = {};
	_.each(args.slice(1), function(pair) {
		var parts = pair.split(':');
		if (parts.length !== 2) {
			U.die(['Column "' + pair + '" is invalid. Must be of the form "column:type".', USAGE])
		}
		columns[parts[0]] = parts[1];
	});

	// assemble columns object into code
	var code = _.template(fs.readFileSync(MODEL_TEMPLATE, 'utf8'), {
		adapter: adapter,
		name: name,
		schema: _.isEmpty(columns) ? '' : prepareColumnsForWriting(columns)
	});	

	// write out the model file
	var modelDir = path.join(paths.app,'models');
	var modelFile = path.join(modelDir, name + '.' + CONST.FILE_EXT.MODEL);
	wrench.mkdirSyncRecursive(modelDir);
    fs.writeFileSync(modelFile, code);
	
	logger.info('Generated model description named "' + name + '" to file "' + modelFile + '"');
}

function prepareColumnsForWriting(columns) {
	var pretty = 'columns: ' + U.prettyPrintJson(columns) + ',\n';
	var output = [];
	_.each(pretty.split('\n'), function(line) {
		if (line === '' || /^\s+$/.test(line)) {
			return; // skip empty line
		}
		output.push('\t\t' + line);
	});
	return output.join('\n');
}





// 	var modelTemplateFile = MODELCODETEMPLATE_FILE,
// 		adapter = 'localDefault',
// 		paths = U.getAndValidateProjectPaths(program.outputPath || program.projectDir);
    
// 	// validate arguments and paths
// 	if (args.length >= 1) {
// 		adapter = args[0];
// 	}

// 	if ((adapter === 'sql' && args.length === 1) || (adapter === 'localDefault' && (args.length === 1 || args.length === 0))) {
// 		U.die(
// 			'You need to specify columns for your model.\n' +
// 			'   `alloy generate model MODEL_NAME COL1:COL_TYPE COL2:COL_TYPE ...`'
// 		);
// 	}

//     var schema = "";
//     var columns = "";
// 	_.each(args, function(pair) {
// 		if (pair.indexOf(':') != -1) {
// 			var arr = pair.split(':');
// 			schema += '\t\t\t"'+arr[0]+'":"'+arr[1]+'",\n';
// 		}
// 	});

//     // added header and footer and remove last comma and new line
// 	if (schema.indexOf(':') != -1) {
// 		columns = '\t\t"columns": {\n'+schema.substring(0, schema.length - 2)+'\n\t\t},'
// 	} 

// 	// generate model code based on model.js template and migrations
// 	var code = _.template(fs.readFileSync(modelTemplateFile, 'utf8'), {
// 		adapter: adapter,
// 		name: name,
// 		schema: columns
// 	});	

// 	wrench.mkdirSyncRecursive(path.join(paths.app,'models'));
// 	var file = path.join(paths.app,'models', name+'.js');
//     fs.writeFileSync(file, code);
	
// 	logger.info('Generated model description named ' + name);

//     if (adapter != 'sql' && adapter != 'localDefault') {
//     	return; // done - migrations not needed
//     }

// 	// generate associated migration
// 	var template = { up: '', down: '' };
// 	var migrationCode = columns.split("\n");
// 	template.up = '\tdb.createTable({\n';
// 	_.each(migrationCode, function(line) {
// 		template.up +=  line+'\n';
// 	});
// 	template.up += '\t\t"adapter": {\n\t\t\t"type": "'+adapter+'",\n\t\t\t"collection_name": "'+name+'"\n\t\t}\n'
// 	template.up += '\t});';
// 	template.down = '\tdb.dropTable("' + name + '");';

// 	// run the migration generator with the template
// 	(require('./migration'))(name, args, program, template);
// }