var _ = require("../../lib/alloy/underscore")._,
	U = require('../../utils'),
	logger = require('../../common/logger'),
	spawn = require('child_process').spawn;

// `alloy run` will just route through the new cli's
// `titanium build` command. All arguments and options
// will just be passed along.
module.exports = function(args, program) {
	logger.warn([
		'`alloy run` is deprecated and is being removed in Alloy 1.1.0.',
		'Please use `titanium build` instead, which what this command uses anyway.'
	]);

	var newArgs = ['build'].concat(program.rawArgs.slice(3));
	if (!_.find(newArgs, function(a) { return a === '-p' || a === '--platform' })) {
		newArgs = newArgs.concat(['--platform','ios']);
	}
	var runcmd = spawn('titanium', newArgs);
	
	//run stdout/stderr back through console.log
	runcmd.stdout.on('data', function (data) {
		filterLog(data);
	});

	runcmd.stderr.on('data', function (data) {
		filterLog(data);
	});
}

//trim extra whitespace output
function filterLog(line) {
	line = U.trim(line);
	if (!line) return;

	var lines = line.split('\n');
	if (lines.length > 1) {
		_.each(lines,function(l) {
			filterLog(l);
		});
		return;
	}
	var idx = line.indexOf(' -- [');
	if (idx > 0) {
		var idx2 = line.indexOf(']', idx+7);
		line = line.substring(idx2+1);
	}
	if (line.charAt(0)=='[') {
		var i = line.indexOf(']');
		var label = line.substring(1,i);
		var rest = U.trim(line.substring(i+1));
		if (!rest) return;
		switch(label) {
			case 'INFO':
				logger.info(rest);
				return;
			case 'TRACE':
			case 'DEBUG':
				logger.debug(rest);
				return;
			case 'WARN':
				logger.warn(rest);
				return;
			case 'ERROR':
				logger.error(rest);
				return;
		}
	}
	logger.debug(line);
}