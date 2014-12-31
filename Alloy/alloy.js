/**
 * Alloy
 * Copyright (c) 2012 by Appcelerator, Inc. All Rights Reserved.
 * See LICENSE for more information on licensing.
 */
 var program = require('commander'),
	logger = require("./logger"),
	os = require('os'),
	U = require('./utils'),
	colors = require("colors"),
	_ = require("./lib/alloy/underscore")._,
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
	}
	console.log = console.warn = console.info = function(m) {
		fs.writeSync(1, m);
	}
}

////////////////////////////////////
////////// MAIN EXECUTION //////////
////////////////////////////////////

// Process command line input
program
	.version(module.exports.version, '-v, --version')
	.description('Alloy command line')
	.usage('COMMAND [ARGS] [OPTIONS]')
	.option('-a, --app <app>', 'Test app folder for running "alloy test"')
	.option('-A, --apply', 'Applies command changes [extract-i18n]')
	.option('-b, --noBanner', 'Disable the banner')
	.option('-c, --config <config>','Pass in compiler configuration')
	.option('-f, --force','Force the command to execute')
	.option('-l, --logLevel <logLevel>', 'Log level (default: 3 [DEBUG])')
	.option('-n, --no-colors','Turn off colors')
	.option('-o, --outputPath <outputPath>', 'Output path for generated code')
	.option('-p, --project-dir <project-dir>', 'Titanium project directory')
	.option('-q, --platform <platform>', 'Target mobile platform [android,ios,mobileweb]')
	.option('-s, --spec <spec>', 'test spec to use with "alloy test"')
	.option('-w, --all','require flag for generate styles')
	.option('-x, --column <column>', 'Column for source map query', 1)
	.option('-y, --line <line>', 'Line for source map query', 1)
	.option('-z, --source <source>', 'Source original file for source map query')
	.option('--widgetname <name>', 'Widget name, used with generate command')
	.option('--testapp <name>', 'Test app name to import, used with new command');

program.command('new'.blue+' <dir>'.white)
		.description('    create a new alloy project'.grey);

program.command('compile'.blue+' [dir]'.white)
		.description('    compile into titanium source code'.grey);

program.command('extract-i18n'.blue+' <language>'.white)
		.description('    extracts i18n strings from the source code (js and tss files)'.grey);

program.command('generate'.blue+' <type> <name>'.white)
		.description('    generate a new alloy type such as a controller'.grey);

program.command('copy'.blue+' <source> <destination>'.white)
		.description('    copy the controller, view, and style files from <source> to <destination>'.grey);

program.command('move'.blue+' <source> <destination>'.white)
		.description('    move the controller, view, and style files from <source> to <destination>'.grey);

program.command('remove'.blue+' <source>'.white)
		.description('    remove the controller, view, and style files at <source>'.grey);

program.parse(process.argv);


// Setup up logging output
Error.stackTraceLimit = Infinity;
logger.stripColors = program['colors'] === false;
logger.logLevel = program['logLevel'] || logger.TRACE;
if(program.config && program.config.indexOf('logLevel')!==-1) {
	logger.logLevel = -1;
}

if (!program.noBanner && program.args[0] !== 'info' && (program.config && program.config.indexOf('noBanner')===-1)) {
	banner();
}

if (program.args.length === 0)
{
	var help = program.helpInformation();
	help = help.replace('Usage: alloy COMMAND [ARGS] [OPTIONS]','Usage: '+'alloy'.blue+' COMMAND'.white+' [ARGS] [OPTIONS]'.grey);
	help = logger.stripColors ? colors.stripColors(help) : help;
	console.log(help);
	process.exit(0);
}

if (program.platform && !_.contains(CONST.PLATFORM_FOLDERS_ALLOY, program.platform)) {
	U.die('Invalid platform "' + program.platform + '" specified, must be [' + CONST.PLATFORM_FOLDERS_ALLOY.join(',') + ']');
}

// Validate the given command
var command = program.args[0];
if (!_.contains(getCommands(), command)) {
	U.die('Unknown command: ' + command.red);
}

// Launch command with given arguments and options
(require('./commands/' + command + '/index'))(program.args.slice(1), program);

///////////////////////////////
////////// FUNCTIONS //////////
///////////////////////////////
function banner() {
	var str =
	"       .__  .__                \n"+
	"_____  |  | |  |   ____ ___.__.\n"+
	"\\__  \\ |  | |  |  /  _ <   |  |\n"+
	" / __ \\|  |_|  |_(  <_> )___  |\n"+
	"(____  /____/____/\\____// ____|\n"+
	"     \\/                 \\/";

	if (!program.dump) {
		console.log(logger.stripColors ? str : str.blue);
		var m = "Alloy " + module.exports.version + " by Appcelerator. The MVC app framework for Titanium.\n".white;
		console.log(logger.stripColors ? colors.stripColors(m) : m);
	}
}

function getCommands() {
	try {
		var commandsPath = path.join(__dirname,'commands');
		return _.filter(fs.readdirSync(commandsPath), function(file) {
			return path.existsSync(path.join(commandsPath,file,'index.js'));
		});
	} catch (e) {
		U.die('Error getting command list', e);
	}
}
