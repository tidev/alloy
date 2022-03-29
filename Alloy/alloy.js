/**
 * Alloy
 * Copyright (c) 2012 by Appcelerator, Inc. All Rights Reserved.
 * See LICENSE for more information on licensing.
 */
var program = require('commander'),
	logger = require('./logger'),
	os = require('os'),
	U = require('./utils'),
	colors = require('colors'),
	_ = require('lodash'),
	pkginfo = require('pkginfo')(module, 'version'),
	path = require('path'),
	fs = require('fs'),
	CONST = require('./common/constants');

// patch to remove the warning in node >=0.8
path.existsSync = fs.existsSync || path.existsSync;

// avoid io issues on Windows in nodejs 0.10.X: https://github.com/joyent/node/issues/3584
if (process.env.ALLOY_TESTS && /^win/i.test(os.platform())) {
	console.error = function(m) {
		fs.writeSync(2, m);
	};
	console.log = console.warn = console.info = function(m) {
		fs.writeSync(1, m);
	};
}

////////////////////////////////////
////////// MAIN EXECUTION //////////
////////////////////////////////////

// Process command line input
program
	.storeOptionsAsProperties() // Enable the legacy behaviour of storing options as properties on the program object
	.version(module.exports.version, '-v, --version')
	.description('Alloy command line')
	.usage('COMMAND [ARGS] [OPTIONS]')
	.option('-a, --app <app>', 'Test app folder for running "alloy test"')
	.option('-A, --apply', 'Applies command changes [extract-i18n]')
	.option('-b, --noBanner', 'Disable the banner')
	.option('-c, --config <config>', 'Pass in compiler configuration')
	.option('-f, --force', 'Force the command to execute')
	.option('-l, --logLevel <logLevel>', 'Log level (default: 3 [DEBUG])')
	.option('-n, --no-colors', 'Turn off colors')
	.option('-o, --outputPath <outputPath>', 'Output path for generated code')
	.option('-p, --project-dir <project-dir>', 'Titanium project directory')
	.option('-q, --platform <platform>', 'Target mobile platform [android,ios]')
	.option('-s, --spec <spec>', 'test spec to use with "alloy test"')
	.option('-w, --all', 'require flag for generate styles')
	.option('-x, --column <column>', 'Column for source map query', 1)
	.option('-y, --line <line>', 'Line for source map query', 1)
	.option('-z, --source <source>', 'Source original file for source map query')
	.option('--widgetname <name>', 'Widget name, used with generate command')
	.option('--testapp <name>', 'Test app name to import, used with new command');

program.command('new [dir]')
	.description('create a new alloy project');

program.command('compile [dir]')
	.description('compile into titanium source code');

program.command('extract-i18n <language>')
	.description('extracts i18n strings from the source code (js and tss files)');

program.command('generate <type> [name]')
	.description('generate a new alloy type such as a controller');

program.command('copy <source> <destination>')
	.description('copy the controller, view, and style files from <source> to <destination>');

program.command('move <source> <destination>')
	.description('move the controller, view, and style files from <source> to <destination>');

program.command('remove <source>')
	.description('remove the controller, view, and style files at <source>');

program.command('info [type]', { hidden: true });

program.command('debugger', { hidden: true });

program.command('install', { hidden: true });

program.command('test', { hidden: true });

program.parse(process.argv);


// Setup up logging output
Error.stackTraceLimit = Infinity;
logger.stripColors = program['colors'] === false;
logger.logLevel = program['logLevel'] || logger.TRACE;
if (program.config && program.config.indexOf('logLevel') !== -1) {
	logger.logLevel = -1;
}

if (!program.noBanner && program.args[0] !== 'info' && (program.config && program.config.indexOf('noBanner') === -1)) {
	banner();
}

if (program.args.length === 0) {
	var help = program.helpInformation();
	help = help.replace('Usage: alloy COMMAND [ARGS] [OPTIONS]', 'Usage: ' + 'alloy'.blue + ' COMMAND'.white + ' [ARGS] [OPTIONS]'.grey);
	help = logger.stripColors ? colors.stripColors(help) : help;
	console.log(help);
	process.exit(0);
}

if (program.platform && !_.includes(CONST.PLATFORM_FOLDERS_ALLOY, program.platform)) {
	U.die('Invalid platform "' + program.platform + '" specified, must be [' + CONST.PLATFORM_FOLDERS_ALLOY.join(',') + ']');
}

// Validate the given command
var command = program.args[0];
if (!_.includes(getCommands(), command)) {
	U.die('Unknown command: ' + command.red);
}

// Launch command with given arguments and options
const cmd = require('./commands/' + command + '/index');
Promise
	.resolve(cmd(program.args.slice(1), program))
	.catch(error => {
		U.die(error.message, error);
	});

///////////////////////////////
////////// FUNCTIONS //////////
///////////////////////////////
function banner() {
	if (!program.dump) {
		var m = 'Alloy ' + module.exports.version + ' by TiDev. The MVC app framework for Titanium.\n'.white;
		console.log(logger.stripColors ? colors.stripColors(m) : m);
	}
}

function getCommands() {
	try {
		var commandsPath = path.join(__dirname, 'commands');
		return _.filter(fs.readdirSync(commandsPath), function(file) {
			return path.existsSync(path.join(commandsPath, file, 'index.js'));
		});
	} catch (e) {
		U.die('Error getting command list', e);
	}
}
