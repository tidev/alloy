var path = require('path'),
	wrench = require('wrench'),
	_ = require("../../lib/alloy/underscore")._,
	U = require('../../utils'),
	logger = require('../../common/logger'),
	titanium = require('../../common/titanium');

module.exports = function(args, program) {
	if (!titanium.home) {
		U.die('run command not supported on platform "' + process.platform + '"');
	}

	// Validate the input path
	var inputPath = path.resolve(args[0] || path.join(U.resolveAppHome(),'..'));
	if (!path.existsSync(inputPath)) {
		U.die('inputPath "' + inputPath + '" does not exist');
	}

	// Validate that this is a Titanium alloy-powered project
	if (U.isTiProject(inputPath)) {
		if (!path.existsSync(path.join(inputPath,'app'))) {
			U.die("This project doesn't seem to contain an Alloy app directory");
		}
	}

	// Check for platform
	var platform = args[1] || 'iphone';
	var resourceDir = (platform === 'ipad') ? 'iphone' : platform;

	// TODO: http://jira.appcelerator.org/browse/ALOY-299
	if (platform === 'mobileweb') {
		U.die('`alloy run` not supported by mobileweb');
	}
	var checkPath = path.join(inputPath,'Resources',resourceDir);

	// assert that the platform directory exists
	if (!path.existsSync(checkPath)) {
		logger.warn('"Resources/' + platform + '" does not exist. Creating...');
		wrench.mkdirSyncRecursive(checkPath,0777);
	}

	//run the project
	var p = titanium.run(
		inputPath,
		args[1], //optional platform
		program.tiversion, //optional version
		program.tiSDK //optional SDK direct path
	);
}