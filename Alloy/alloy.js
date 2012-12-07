/**
 * Alloy
 * Copyright (c) 2012 by Appcelerator, Inc. All Rights Reserved.
 * See LICENSE for more information on licensing.
 */
 var program = require('commander'),
	logger = require("./common/logger"),
	U = require('./utils'),
	colors = require("colors"),
	_ = require("./lib/alloy/underscore")._,
	pkginfo = require('pkginfo'),
	path = require('path'),
	fs = require('fs'),
	CONST = require('./common/constants');

// patch to remove the warning in node >=0.8
path.existsSync = fs.existsSync || path.existsSync;

// setup our module so have the pkginfo version from package.json
pkginfo(module,'name','version');

////////////////////////////////////
////////// MAIN EXECUTION //////////
////////////////////////////////////

// Process command line input
program
	.version(module.exports.version, '-v, --version')
	.description('Alloy command line')
	.usage('COMMAND [ARGS] [OPTIONS]')
	.option('-a, --allStackTrace', 'No limit to the size of stack traces')
	.option('-b, --noBanner', 'Disable the banner')
	.option('-c, --config <config>','Pass in compiler configuration')
	.option('-f, --force','Force the command to execute')
	.option('-l, --logLevel <logLevel>', 'Log level (default: 3 [DEBUG])')
	.option('-n, --no-colors','Turn off colors')
	.option('-o, --outputPath <outputPath>', 'Output path for generated code')
	.option('-p, --project-dir <project-dir>', 'Titanium project directory')
	.option('-q, --platform <platform>', 'Target mobile platform [android,ios,mobileweb]')
	.option('-s, --tiSDK <tiSDK>', 'Full path to Titanium SDK to use with run command')
	.option('-t, --tiversion <tiversion>', 'Titanium SDK version used for run command');

program.command('new'.blue+' <dir>'.white)
		.description('    create a new alloy project'.grey);

program.command('compile'.blue+' [dir]'.white)
		.description('compile into titanium sourcecode'.grey);

program.command('run'.blue+' [dir] [platform]'.white)
		.description('compile and run alloy. defaults to iphone'.grey);

program.command('generate'.blue+' <type> <name>'.white)
		.description('    generate a new alloy type such as a controller'.grey);

program.parse(process.argv);
	

// Setup up logging output
//if (program.allStackTrace) { Error.stackTraceLimit = Infinity; }
Error.stackTraceLimit = Infinity;
logger.stripColors = program['colors'] === false;

if (!program.noBanner && program.args[0] !== 'info') {
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
		var m = "Alloy by Appcelerator. The MVC app framework for Titanium.\n".white;
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
