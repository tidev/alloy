var fs = require('fs'),
	path = require('path'),
	U = require('../Alloy/utils'),
	_ = require('../Alloy/lib/alloy/underscore')._,
	CONST = require('../Alloy/common/constants'),
	logger = require('../Alloy/common/logger');

// Fix node warning 
path.existsSync = fs.existsSync || path.existsSync;

var	wrench = require('wrench'),
	spawn = require('child_process').spawn,
	harnessTemplatePath = path.join(process.cwd(),'test','projects','HarnessTemplate'),
	harnessAppPath = path.join(process.cwd(),'test','projects','Harness'),
	targetAppPath = path.join(harnessAppPath,'app'),
	resourcesPath = path.join(harnessAppPath,'Resources');

function log(message) {
	if (!process.env.quiet) {
		console.log(message);
	}
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

function runApp() {
	log('Running sample app "'+process.env.dir+'"...');

	// create array for `titanium build` args
	var e = process.env;
	var newArgs = ['build',
		'--project-dir', harnessAppPath,
		'--platform', e.platform || 'ios'
	];
	e.tiversion && (newArgs = newArgs.concat(['--sdk',e.tiversion]));
	e.simtype && (newArgs = newArgs.concat(['--sim-type',e.simtype]));

	//run stdout/stderr back through console.log
	var runcmd = spawn('titanium', newArgs);
	runcmd.stdout.on('data', function (data) {
		filterLog(data);
	});

	runcmd.stderr.on('data', function (data) {
		filterLog(data);
	});
}

namespace('app', function() {
	desc('remove the contents of the test harness\' "app" directory');
	task('clobber', function() {
		log('Reseting the Harness app from template...');
		wrench.rmdirSyncRecursive(harnessAppPath, true);
		wrench.mkdirSyncRecursive(harnessAppPath, 0777);
		wrench.copyDirSyncRecursive(harnessTemplatePath, harnessAppPath);
	});
	
	desc('compile the example app in the given directory name and stage for launch, e.g. "jake app:setup dir=masterdetail"');
	task('setup', ['app:clobber'], function() {
		log('Initializing Alloy project...');
		if (!path.existsSync(resourcesPath)) {
			wrench.mkdirSyncRecursive(resourcesPath, 0777);
		}
		require('child_process').exec('alloy new -f "' + harnessAppPath + '"', function(error, stdout, stderr) {
			if (error) {
				console.log(stdout);
				console.log(stderr);
				console.log(error);
				process.exit(1);
			} else {
				log('Staging sample app "'+process.env.dir+'" for launch...');
				wrench.copyDirSyncRecursive(path.join(process.cwd(), 'test', 'apps', process.env.dir), targetAppPath, {preserve:true});
			}
		});
	});
	
	desc('run an example, all but dir are optional: e.g. "jake app:run dir=masterdetail platform=android tiversion=2.0.2.GA tisdk=<path to sdk>"');
	task('run', ['app:setup'], function() {		
		runApp();
	});

	desc('copy a sample app\'s "app" folder into the Harness');
	task('quickrun', function() {
		log('Quick-running sample app "' + process.env.dir + '"...');
		log('Staging sample app "' + process.env.dir + '" for launch...');
		wrench.copyDirSyncRecursive(path.join(process.cwd(), 'test', 'apps', process.env.dir), targetAppPath, {preserve:true});
		runApp();
	});
});
