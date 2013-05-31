var fs = require('fs'),
	path = require('path'),
	wrench = require('wrench'),
	platforms = require('../platforms/index'),
	_ = require('../Alloy/lib/alloy/underscore')._,
	colors = require('colors'),
	exec = require('child_process').exec;

var alloyRoot = path.join(__dirname,'..'),
	paths = {
		apps: path.join(alloyRoot,'test','apps'),
		harness: path.join(alloyRoot,'test','projects','Harness') 
	},
	platformsArray = _.keys(platforms),
	platformCtr = 0;

// make sure we get a test app
var testApp = process.argv[2];
if (!testApp) {
	console.error('You must specify a test app');
	console.error('  ex. node testgen.js advanced/device_query');
	process.exit(1);
} else {
	console.log('generating code for ' + testApp.yellow);
}

// Stage the app
var cmd = 'jake app:setup dir=' + testApp + ' quiet=1';
exec(cmd, function(error, stdout, stderr) {
	if (error !== null) {
		console.error(error);
		console.error(stderr);
		process.exit(2);
	}

	doCompile(platformsArray[platformCtr++]);
});

function doCompile(platform) {
	if (!platform) { return; }

	exec('alloy compile ' + paths.harness + ' --config platform=' + platform, function(error, stdout, stderr) {
		if (error !== null) {
			console.error(error);
			console.error(stderr);
			process.exit(3);
		}

		var genDir = path.join(paths.apps,testApp,'_generated',platform);
		wrench.rmdirSyncRecursive(genDir,true);
		wrench.mkdirSyncRecursive(genDir,0777);

		var locations = [
			path.join('alloy','controllers'),
			path.join('alloy','models'),
			path.join('alloy','widgets')
		];
		_.each(locations, function(l) {
			var src = path.join(paths.harness,'Resources',l);
			var dst = path.join(genDir,l);
			if (fs.existsSync(src) && fs.readdirSync(src).length !== 0) {
				wrench.mkdirSyncRecursive(dst,0777);
				wrench.copyDirSyncRecursive(src,dst);

				// we don't need to evaluate BaseController.js every time
				var bc = path.join(dst,'BaseController.js');
				if (l === path.join('alloy','controllers') && fs.existsSync(bc)) {
					fs.unlinkSync(bc);
				}

				console.log('Generated runtime files in ' + 
					path.join('_generated',platform,l).cyan
				);
			}
		});

		doCompile(platformsArray[platformCtr++]);
	});
}

