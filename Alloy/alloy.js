/**
 * Alloy
 * Copyright (c) 2012 by Appcelerator, Inc. All Rights Reserved.
 * See LICENSE for more information on licensing.
 */
var fs = require('fs'),
	path = require('path')
	program = require('commander'),
	logger = require("./common/logger"),
	U = require('./utils'),
	wrench = require("wrench"),
	colors = require("colors"),
	_ = require("./lib/alloy/underscore")._,
	generators = require('./generators'),
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

function run(args)
{
	if (process.platform != 'darwin')
	{
		U.die("Sorry, Alloy doesn't yet support the `run` command on this platform (" + process.platform + ")");
	}
	
	var inputPath = path.resolve(args.length > 0 ? args[0] : U.resolveAppHome());
	
	if (!path.existsSync(inputPath)) 
	{
		U.die('inputPath "' + inputPath + '" does not exist');
	}
	
	if (U.isTiProject(inputPath))
	{
		inputPath = path.join(inputPath,'app');
		if (!path.existsSync(inputPath))
		{
			U.die("This project doesn't seem to contain an Alloy app");
		}
	}
		
	var platform = args.length > 1 ? args[1] : 'iphone'; // TODO: check tiapp.xml for <deployment-targets>
	
	var sdkRoot = path.resolve('/Library/Application Support/Titanium/mobilesdk/osx')
	if (path.existsSync(sdkRoot))
	{
		var dirs = fs.readdirSync(sdkRoot);
		if (dirs.length > 0)
		{
			// sort and get the latest if we don't pass it in
			dirs = dirs.sort();
			sdkRoot = path.join(sdkRoot, dirs[dirs.length-1]);
		}
	}
	
	if (sdkRoot && path.existsSync(sdkRoot))
	{
		function trim(line)
		{
			return String(line).replace(/^\s\s*/, '').replace(/\s\s*$/, '');
		}
		function filterLog(line)
		{
			line =trim(line);
			if (!line) return;
			var lines = line.split('\n');
			if (lines.length > 1)
			{
				_.each(lines,function(l){
					filterLog(l);
				});
				return;
			}
			var idx = line.indexOf(' -- [');
			if (idx > 0)
			{
				var idx2 = line.indexOf(']', idx+7);
				line = line.substring(idx2+1);
			}
			if (line.charAt(0)=='[')
			{
				var i = line.indexOf(']');
				var label = line.substring(1,i);
				var rest = trim(line.substring(i+1));
				if (!rest) return;
				switch(label)
				{
					case 'INFO':
					{
						logger.info(rest);
						return;
					}
					case 'TRACE':
					case 'DEBUG':
					{
						logger.debug(rest);
						return;
					}
					case 'WARN':
					{
						logger.warn(rest);
						return;
					}
					case 'ERROR':
					{
						logger.error(rest);
						return;
					}
				}
			}
			logger.debug(line);
		}

		var spawn = require('child_process').spawn;
		
		//run the project using titanium.py
		var runcmd = spawn('python', [
			path.join(sdkRoot,'titanium.py'),
			'run',
			'--dir=' + inputPath ,
			'--platform=' + platform
		],process.env);
		
		//run stdout/stderr back through console.log
		runcmd.stdout.on('data', function (data) {
			filterLog(data);
		});

		runcmd.stderr.on('data', function (data) {
			filterLog(data);
		});

		runcmd.on('exit', function (code) {
		  	logger.info('Finished with code ' + code);
		});
	}
	else
	{
		U.die("Couldn't find Titanium SDK at "+sdkRoot);
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
		{
			(require('./commands/'+action))(newargs, program);
			break;
		}
		case 'run':
		{
			run(newargs);
			break;
		}
		default:
		{
			U.die('Unknown action: '+action.red);
		}
	}
}

main(program.args);
