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
	pkginfo = require('pkginfo')(module, 'name', 'version');

// TODO: get the action list from the commands directory
var ACTIONS = ['compile', 'generate', 'new', 'run'];

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
	.option('-d, --dump','Dump the generated app.js to console')
	.option('-f, --force','Force the command to execute')
	.option('-n, --no-colors','Turn off colors')
	.option('-c, --config <config>','Pass in compiler configuration')
	.parse(process.argv);

// Setup up logging output
logger.stripColors = (program.colors==false);
banner();

// Validate the command line action
var action = program.args[0];
if (!action) {
	U.die('You must supply an ACTION as the first argument');
}
if (!_.contains(ACTIONS, action)) {
	U.die('Unknown action: ' + action.red);
}

// Launch command with given arguments and options
(require('./commands/'+action))(program.args.slice(1), program);


