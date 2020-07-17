/**
 * Alloy
 * Copyright (c) 2012 by Appcelerator, Inc. All Rights Reserved.
 * See LICENSE for more information on licensing.
 */
const program = require('commander');
const path = require('path');
const fs = require('fs');
const colors = require('colors');

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

// Process command line input
program
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

program.command('new'.blue + ' <dir>'.white)
	.description('    create a new alloy project'.grey);

program.command('compile'.blue + ' [dir]'.white)
	.description('    compile into titanium source code'.grey);

program.command('extract-i18n'.blue + ' <language>'.white)
	.description('    extracts i18n strings from the source code (js and tss files)'.grey);

program.command('generate'.blue + ' <type> <name>'.white)
	.description('    generate a new alloy type such as a controller'.grey);

program.command('copy'.blue + ' <source> <destination>'.white)
	.description('    copy the controller, view, and style files from <source> to <destination>'.grey);

program.command('move'.blue + ' <source> <destination>'.white)
	.description('    move the controller, view, and style files from <source> to <destination>'.grey);

program.command('remove'.blue + ' <source>'.white)
	.description('    remove the controller, view, and style files at <source>'.grey);

program.parse(process.argv);


const Alloy = require('./alloy');
const alloy = new Alloy({program});
alloy.execute();