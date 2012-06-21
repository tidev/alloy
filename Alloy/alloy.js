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

//
//TODO: we need a much more robust help from command line -- see sort of what i did in titanium
//TODO: handle localization files and merging
//

/**
 * ACTIONS:
 *
 * - new [path] - create a new project
 * - compile - compile the project
 * - generate [type] - generate an object such as a model or controller
 */
		
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




}

function main(args)
{
	logger.stripColors = (program.colors==false);
	banner();
	
	if (args.length == 0) {
		U.die('You must supply an ACTION as the first argument');
	}
	
	var action = args[0],
		newargs = args.slice(1);

	// TODO: validate "action" by checking for list of actions in the 
	//       Alloy/commands directory
	
	switch(action)
	{
		case 'new':
		case 'compile':
		case 'generate':
		case 'run':
		{
			(require('./commands/'+action))(newargs, program);
			break;
		}
		default:
		{
			U.die('Unknown action: '+action.red);
		}
	}
}

main(program.args);
