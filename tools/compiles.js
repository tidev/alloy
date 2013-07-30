var async = require('async'),
	path = require('path'),
	exec = require('child_process').exec,
	platforms = require('../platforms'),
	_ = require('../Alloy/lib/alloy/underscore');

var harnessPath = path.join(__dirname, '..', 'test', 'projects', 'Harness');

async.parallel(_.map(platforms, function(p) {
	return function() {
		var cmd = 'alloy compile --outputPath "' + harnessPath + '" --config platform=' +
			p.platform;
		exec(cmd, function(error, stdout, stderr) {
			if (error !== null) {
				console.error(error);
			} else {
				console.log(stdout);
			}
		});
	};
}));

