var fs = require('fs-extra'),
	chmodr = require('chmodr'),
	path = require('path'),
	platforms = require('../platforms/index'),
	_ = require('lodash'),
	colors = require('colors'),
	exec = require('child_process').exec,
	TESTS_WITH_DATES = ['ALOY-263', 'ALOY-1003', 'ALOY-1058'],
	TESTS_TO_SKIP = ['ALOY-840', 'ALOY-887', 'ALOY-932', 'ALOY-1080'];

var alloyRoot = path.join(__dirname, '..'),
	paths = {
		apps: path.join(alloyRoot, 'test', 'apps'),
		harness: path.join(alloyRoot, 'test', 'projects', 'Harness')
	},
	platformsArray = _.keys(platforms),
	platformCtr = 0;

// make sure we get a test app
var testApp = process.argv[2];
if (!testApp) {
	console.error('You must specify a test app');
	console.error('  ex. node testgen.js advanced/device_query');
	process.exit(1);
} else if (TESTS_TO_SKIP.indexOf(testApp) !== -1) {
	console.log((testApp + ' has code known to fail matching generated code. Canceling creation of _generated code.').yellow);
	process.exit();
} else if (TESTS_WITH_DATES.indexOf(testApp) !== -1) {
	console.log((testApp + ' contains date functions, which create localized code unlikely to match on other systems.').yellow);
	console.log(('Canceling creation of _generated code.').yellow);
	process.exit();
} else {
	console.log('generating code for ' + testApp.yellow);
}

// Stage the app
var cmd = 'npx jake app:setup dir=' + testApp + ' quiet=1';
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

		var genDir = path.join(paths.apps, testApp, '_generated', platform);
		fs.removeSync(genDir);
		fs.mkdirpSync(genDir);
		chmodr.sync(genDir, 0777);

		var locations = [
			path.join('alloy', 'controllers'),
			path.join('alloy', 'models'),
			path.join('alloy', 'widgets')
		];
		_.each(locations, function(l) {
			var src = path.join(paths.harness, 'Resources', (platform === 'ios' ? 'iphone' : platform), l);
			var dst = path.join(genDir, l);
			if (fs.existsSync(src) && fs.readdirSync(src).length !== 0) {
				fs.mkdirpSync(dst);
				chmodr.sync(dst, 0777);
				fs.copySync(src, dst);

				// we don't need to evaluate BaseController.js every time
				var bc = path.join(dst, 'BaseController.js');
				if (l === path.join('alloy', 'controllers') && fs.existsSync(bc)) {
					fs.unlinkSync(bc);
				}

				console.log('Generated runtime files in ' +
					path.join('_generated', platform, l).cyan
				);
			}
		});

		doCompile(platformsArray[platformCtr++]);
	});
}
