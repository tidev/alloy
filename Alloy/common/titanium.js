//Utilities for finding and working with the Titanium SDK
var path = require('path'),
	fs = require('fs'),
	spawn = require('child_process').spawn,
	_ = require("../lib/alloy/underscore"),
	U = require('../utils'),
	logger = require('../common/logger');

// SDK constants for supported platforms
var HOME = process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
var SDK_PATHS = {
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
};

// Find out to which path the SDK is installed on OSX
if (process.platform === 'darwin') {
	var osxSdkPaths = [
		SDK_PATHS.darwin.path,
		path.join(HOME, SDK_PATHS.darwin.path)
	];
	_.each(osxSdkPaths, function(sdkPath) {
		if (path.existsSync(path.join(sdkPath, SDK_PATHS.darwin.suffix))) {
			SDK_PATHS.darwin.path = sdkPath;
		}
	});
	if (!SDK_PATHS.darwin.path) {
		U.die('Unable to find Titanium SDK, looked in: \n' + osxSdkPaths.join('\n'));
	}
}

//The final SDK location, based on current platform
var TITANIUM_HOME = process.env.TITANIUM_HOME || SDK_PATHS[process.platform].path;
exports.home = TITANIUM_HOME;

var SDK = path.join(TITANIUM_HOME,SDK_PATHS[process.platform].suffix);
exports.SDK = SDK;

//enumerate the Titanium Mobile SDK versions that are currently installed
var versions = _.without(fs.readdirSync(SDK).sort(), '.DS_Store').reverse();
exports.versions = versions;

//spawn an evented child process, which is an invocation of an SDK .py script
//returns the spawned process so you can listen for events (if you care)
//pyScript is resolved relative to the SDK root directory
function py(pyScript, args, version /*optional*/, sdkDir /*optional*/) {
	//use the version they specified, or the latest from the list
	version = version || versions[0];

	//trim extra whitespace from titanium.py output
	function filterLog(line) {
		line =U.trim(line);
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
	
	//invoke .py - use the provided SDK dir if present
	var sdkRoot = sdkDir || path.join(SDK, version);
	var script = path.join(sdkRoot,pyScript);
	var runcmd = spawn('python', [script].concat(args||[]), process.env);
	
	//run stdout/stderr back through console.log
	runcmd.stdout.on('data', function (data) {
		filterLog(data);
	});

	runcmd.stderr.on('data', function (data) {
		filterLog(data);
	});
	
	return runcmd;
}
exports.py = py;

//run a titanium project with titanium.py - return the spawned titanium.py process
exports.run = function(projectDir, platform /*optional*/, version /*optional*/, sdkDir /*optional*/) {
	// Validate the input path
	if (!path.existsSync(projectDir)) {
		U.die('projectDir "' + projectDir + '" does not exist');
	}

	// Get the target platform
	// TODO: check tiapp.xml for <deployment-targets>
	platform = platform || 'iphone';

	//run the project using titanium.py
	var runArgs = [
		'run',
		'--dir=' + path.resolve(projectDir),
		'--platform=' + platform
	];
	
	return py('titanium.py', runArgs, version, sdkDir);
};

//create a titanium project - create('FooProject', 'com.appc.foo', ['mobileweb','iphone', 'android'], '/etc/android')
//returns evented process
exports.create = function(name,id,topLevelDir,platformsArray,androidDir, version /*optional*/, sdkDir /*optional*/) {
	var runArgs = [name, id, topLevelDir];
	runArgs.concat(platformsArray);
	//look for Android SDK environment variable
	runArgs.push(androidDir||process.env.ANDROID_SDK);
	
	return py('project.py', runArgs, version, sdkDir);
};
