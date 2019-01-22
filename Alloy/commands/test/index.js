/*
	Stub / incomplete file
*/
var fs = require('fs'),
	path = require('path'),
	spawn = require('child_process').spawn,
	U = require('../../utils'),
	logger = require('../../logger');

var ALLOY_ROOT = path.join(__dirname, '../../..');
var JAKE = path.join(ALLOY_ROOT, 'node_modules', '.bin', 'jake');

module.exports = function(args, program) {
	logger.error('"alloy test" is not yet implemented');

	// make sure jake dependency is present
	if (!fs.existsSync(JAKE)) {
		console.log(JAKE);
		U.die([
			'jake is not installed. Trying reinstalling alloy.',
			'  [sudo] npm install -g alloy'
		]);
	}

	// argument/option validation
	var newArgs = [];
	if (program.spec && program.app) {
		logger.warn('Ignoring --app, --spec takes precedence...');
	}

	// determine whether we're running a spec or a test app
	if (!program.spec && !program.app) {
		newArgs.push('test:all');
	} else if (program.spec) {
		if (program.spec === 'all') {
			newArgs.push('test:all');
		} else {
			newArgs.push('test:spec[' + program.spec + ']');
		}
	} else if (program.app) {
		newArgs.push('app:run', 'dir=' + program.app);
	}

	// add platform, if present
	if (program.platform) {
		newArgs.push('platform=' + program.platform);
	}

	// print stdout/stderr back through console.log
	logger.debug(JAKE + ' ' + newArgs.join(' '));
	var testcmd = spawn(JAKE, newArgs);
	testcmd.stdout.on('data', function (data) {
		console.log(U.trim(data + ''));
	});

	testcmd.stderr.on('data', function (data) {
		console.log(U.trim(data + ''));
	});
};
