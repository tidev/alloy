var path = require('path'),
	fs = require('fs'),
	wrench = require('wrench'),
	U = require('../../../utils'),
	CONST = require('../../../common/constants'),
	_ = require('../../../lib/alloy/underscore')._,
	logger = require('../../../logger');

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
			U.die([
				'Column "' + pair + '" is invalid. Must be of the form "column:type".',
				USAGE
			]);
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
};

function prepareColumnsForWriting(columns) {
	var pretty = 'columns: ' + JSON.stringify(columns, null, 4) + ',\n';
	var output = [];
	_.each(pretty.split('\n'), function(line) {
		if (line === '' || /^\s+$/.test(line)) {
			return; // skip empty line
		}
		output.push('\t\t' + line);
	});
	return output.join('\n');
}