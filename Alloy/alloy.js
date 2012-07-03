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
	fs = require('fs');

// setup our module so have the pkginfo version from package.json
pkginfo(module,'name','version');

// TODO: get the action list from the commands directory
var ACTIONS = ['compile', 'generate', 'new', 'run'];

// patch to remove the warning in node >=0.8
path.existsSync = fs.existsSync || path.existsSync;

//
//TODO: we need a much more robust help from command line -- see sort of what i did in titanium
//TODO: handle localization files and merging
//

function banner()
{
	var str = 
	"       .__  .__                \n"+
	"_____  |  | |  |   ____ ___.__.\n"+
	"\\__  \\ |  | |  |  /  _ <   |  |\n"+
	" / __ \\|  |_|  |_(  <_> )___  |\n"+
	"(____  /____/____/\\____// ____|\n"+
	"     \\/                 \\/";
	
	if (!program.dump)
	{
		console.log(logger.stripColors ? str : str.blue);
		var m = "Alloy by Appcelerator. The MVC app framework for Titanium.\n".white;
		console.log(logger.stripColors ? colors.stripColors(m) : m);
	}
}

////////////////////////////////////
////////// MAIN EXECUTION //////////
////////////////////////////////////

// Process command line input
program
	.version(module.exports.version)
	.description('Alloy command line')
	.usage('ACTION [ARGS] [OPTIONS]')
	.option('-o, --outputPath <outputPath>', 'Output path for generated code')
	.option('-l, --logLevel <logLevel>', 'Log level (default: 3 [DEBUG])')
	.option('-f, --force','Force the command to execute')
	.option('-n, --no-colors','Turn off colors')
	.option('-c, --config <config>','Pass in compiler configuration')
	.option('-s, --tiSDK', 'Full path to Titanium SDK to use with run command')
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
logger.stripColors = (program.colors===false);
banner();

if (program.args.length === 0)
{
	var help = program.helpInformation();
	help = help.replace('Usage: alloy ACTION [ARGS] [OPTIONS]','Usage: '+'alloy'.blue+' ACTION'.white+' [ARGS] [OPTIONS]'.grey);
	help = logger.stripColors ? colors.stripColors(help) : help;
	console.log(help);
	process.exit(1);
}

// Validate the command line action
var action = program.args[0];
if (!_.contains(ACTIONS, action)) {
	U.die('Unknown action: ' + action.red);
}

// Launch command with given arguments and options
(require('./commands/' + action + '/index'))(program.args.slice(1), program);

