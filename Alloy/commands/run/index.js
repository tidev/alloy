var path = require('path'),
	_ = require("../../lib/alloy/underscore")._,
	U = require('../../utils'),
	logger = require('../../common/logger'),
	titanium = require('../../common/titanium');

module.exports = function(args, program) {
	if (!titanium.home) {
		U.die('run command not supported on platform "' + process.platform + '"');
	}

	// Validate the input path
	var inputPath = path.resolve(args.length > 0 ? args[0] : U.resolveAppHome());
	if (!fs.existsSync(inputPath)) {
		U.die('inputPath "' + inputPath + '" does not exist');
	}
	
	// Validate that this is a Titanium alloy-powered project
	if (U.isTiProject(inputPath)) {
		if (!fs.existsSync(path.join(inputPath,'app'))) {
			U.die("This project doesn't seem to contain an Alloy app directory");
		}
	}
	
	//run the project
	var p = titanium.run(
		inputPath, 
		args[1], //optional platform
		program.tiversion, //optional version
		program.tiSDK //optional SDK direct path
	);
}