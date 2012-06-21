var path = require('path'),
	fs = require('fs'),
	spawn = require('child_process').spawn,
	_ = require("../lib/alloy/underscore")._,
	U = require('../utils'),
	logger = require('../common/logger');

// SDK constants for supported platforms
var HOME = process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
var SDK = {
	darwin: {
		path: '/Library/Application Support/Titanium/',
		suffix: 'mobilesdk/osx'
	},
	linux: {
		path: '~/.titanium/',
		suffix: 'mobilesdk/linux'
	},
	win32: {
		path: path.join(process.env.APPDATA, 'Titanium'),
		suffix: 'mobilesdk\\win32'
	}
}

// Find out to which path the SDK is installed on OSX
if (process.platform === 'darwin') {
	var osxSdkPaths = [
		SDK.darwin.path,
		path.join(HOME, SDK.darwin.path)
	];
	_.each(osxSdkPaths, function(sdkPath) {
		if (path.existsSync(sdkPath)) {
			SDK.darwin.path = sdkPath;
		}
	});
	if (!SDK.darwin.path) {
		U.die('Unable to find Titanium SDK, looked in: \n' + osxSdkPaths.join('\n'));
	}
}

module.exports = function(args, program) {
	var sdk = SDK[process.platform];
	if (!sdk) {
		U.die('run command not supported on platform "' + process.platform + '"');
	}
	sdk.osPath = path.join(sdk.path, sdk.suffix);

	// Validate the input path
	var inputPath = path.resolve(args.length > 0 ? args[0] : U.resolveAppHome());
	if (!path.existsSync(inputPath)) {
		U.die('inputPath "' + inputPath + '" does not exist');
	}
	
	// Validate that this is a Titanium alloy-powered project
	if (U.isTiProject(inputPath)) {
		if (!path.existsSync(path.join(inputPath,'app'))) {
			U.die("This project doesn't seem to contain an Alloy app directory");
		}
	}

	// Get the target platform
	// TODO: check tiapp.xml for <deployment-targets>
	var platform = args.length > 1 ? args[1] : 'iphone';

	// Find and validate target SDK for build
	var targetSdk = args[2];
	if (targetSdk) {
		sdk.target = path.join(sdk.osPath, targetSdk);
	}
	if (!sdk.target && path.existsSync(sdk.osPath)) {
		var dirs = fs.readdirSync(sdk.osPath);
		if (dirs.length > 0) {
			// sort and get the latest if we don't pass it in
			dirs = dirs.sort();
			sdk.target = path.join(sdk.osPath, dirs[dirs.length-1]);
		} 
	} 

	if (!sdk.target || !path.existsSync(sdk.target)) {
		U.die('Unable to find target SDK ' + (sdk.target || sdk.osPath));
	}

	function filterLog(line) {
		line =U.trim(line);
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
			var rest = U.trim(line.substring(i+1));
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

	//run the project using titanium.py
	var runArgs = [
		path.join(sdk.target,'titanium.py'),
		'run',
		'--dir=' + path.resolve(inputPath),
		'--platform=' + platform
	];
	var runcmd = spawn('python', runArgs, process.env);
	
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