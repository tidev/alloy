var SM = require('source-map'),
	program = require('commander'),
	fs = require('fs');

var FUNCTIONS = {
	generated: 'generatedPositionFor',
	original: 'originalPositionFor'
};

function die(msg) {
	console.error('[ERROR] ' + (msg || ''));
	program.help();
}

program
	.version(module.exports.version, '-v, --version')
	.description('CLI tool for consuming and querying source-map source maps')
	.usage('<generated|original> <source_map_file> [options]')
	.option('-c, --column <column>', 'The column number to use in the source map query', 1)
	.option('-l, --line <line>', 'The line number to use in the source map query', 1)
	.option('-s, --source <source>', 'Filename of the original source file when querying for a generated position');

program.command('generated')
	.description('    Returns the generated line and column information for the original source, line, and column positions provided');

program.command('original')
	.description('    Returns the original source, line, and column information for the generated source\'s line and column positions provided');

program.on('--help', function(){
  console.log('  Examples:');
  console.log('');
  console.log('    # Get original position for line 5 from "Resources/app.js".');
  console.log('    $ node consumer.js original .map/Resources/app.js.map -l 5');
  console.log('');
  console.log('    # Get the generated position for line 123, column 5 of the');
  console.log('    # original file "app/controllers/index.js".');
  console.log('    $ node consumer.js generated "Resources/alloy/controllers/index.js" -l 123 -c 5 -s "app/controllers/index.js"');
  console.log('');
});

// TODO: add examples in help

program.parse(process.argv);

// validate arguments
if (program.args.length === 0) {
	die('Missing command and source map file');
} else if (program.args.length === 1) {
	die('Missing source map file');
} 

var command = program.args[0];
var func = FUNCTIONS[command];
if (!func) {
	die('Invalid command "' + command + '". Must be "original" or "generated".');
}

var sourceMapFile = program.args[1];
if (!fs.existsSync(sourceMapFile)) {
	die('Source map file "' + sourceMapFile + '" does not exist');
}

// read the source map and generate the consumer
var sourceMap = fs.readFileSync(sourceMapFile, 'utf8');
var consumer = new SM.SourceMapConsumer(sourceMap);
var obj = {
	line: program.line,
	column: program.column
};
program.source && (obj.source = program.source);

// execute the source map query and output the info
var ret = consumer[func](obj);
console.log(ret);
