var async = require('async'),
	path = require('path'),
	exec = require('child_process').exec,
	platforms = require('../platforms'),
	_ = require('lodash');

var harnessPath = path.join(__dirname, '..', 'test', 'projects', 'Harness');

async.series(_.map(platforms, function(p) {

	// return a function that compiles and copies generated code for the given app
	return function(callback) {

		// compile the app for all platforms
		var cmd = 'alloy compile --outputPath "' + harnessPath + '" --config platform=' + p.platform;
		console.log(cmd);
		exec(cmd, function(err, stdout, stderr) {
			if (err) { return callback(err); }

			// copy the generated controllers
			var src = path.join(harnessPath, 'Resources', p.titaniumFolder, 'alloy', 'controllers', '*');
			var dst = path.join(__dirname, '..', 'test', 'apps', process.argv[2], '_generated', p.platform, 'alloy', 'controllers');
			var cmd2 = 'cp -r ' + src + ' ' + dst + '/ && rm ' + dst + '/BaseController.js';
			console.log(cmd2);
			exec(cmd2, function(err, stdout, stderr) {
				return callback(err);
			});
		});
	};
}), function(err, results) {
	if (err) { throw new Error(err); }
});
