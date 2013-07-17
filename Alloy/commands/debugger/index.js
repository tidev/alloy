var fs = require('fs'),
	path = require('path'),
	U = require('../../utils'),
	SM = require('source-map');

var FUNCTIONS = {
	generated: 'generatedPositionFor',
	original: 'originalPositionFor'
};

module.exports = function(args, program) {
	// validate arguments
	if (args.length === 0) {
		U.die('Missing command and source map file');
	} else if (args.length === 1) {
		U.die('Missing source map file');
	}

	var command = args[0];
	var func = FUNCTIONS[command];
	if (!func) {
		U.die('Invalid command "' + command + '". Must be "original" or "generated".');
	} else if (command === 'generated' && !program.source) {
		U.die('You must specify a source origin file (-z, --source) when querying for generated positions');
	}

	var sourceMapFile = args[1];
	if (!fs.existsSync(sourceMapFile)) {
		U.die('Source map file "' + sourceMapFile + '" does not exist');
	}

	// read the source map and generate the consumer
	var sourceMap = fs.readFileSync(sourceMapFile, 'utf8');
	var consumer = new SM.SourceMapConsumer(sourceMap);
	var obj = {
		line: program.line,
		column: program.column
	};
	if (program.source) { obj.source = program.source; }

	// execute the source map query and output the info
	var ret = consumer[func](obj);

	// If the returned source is the same as the source map,
	// just send back the same line number. The returned source
	// in this case actually refers to the Alloy template file
	// used as the base of the composite controller, and this
	// has no meaning to deveopers since it is not included in
	// the application itself, only in the Alloy module.
	var absolute = path.resolve(sourceMapFile);
	if (command === 'original' &&
		(new RegExp(ret.source + '\\.map$')).test(absolute)) {
		ret.line = program.line;
	}

	console.log(ret);
};
