var fs = require('fs-extra'),
	chmodr = require('chmodr'),
	path = require('path'),
	os = require('os'),
	U = require('../Alloy/utils'),
	_ = require('lodash'),
	CONST = require('../Alloy/common/constants'),
	logger = require('../Alloy/logger');

// Fix node warning
path.existsSync = fs.existsSync || path.existsSync;

var	spawn = require('child_process').spawn,
	harnessTemplatePath = path.join(process.cwd(),'test','projects','HarnessTemplate'),
	harnessAppPath = path.join(process.cwd(),'test','projects','Harness'),
	targetAppPath = path.join(harnessAppPath,'app'),
	resourcesPath = path.join(harnessAppPath,'Resources'),
	appDir = (/^ALOY-\d+$/.test(process.env.dir) ? 'testing/' : '') + process.env.dir;

var IS_WIN = /^win/i.test(os.platform());
var IS_OSX = os.platform() === 'darwin';

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
	log('Running sample app "'+appDir+'"...');

	// create array for `titanium build` args
	var args = process.argv;
	var newArgs = ['build',
		'--project-dir', harnessAppPath
	];
	_.each(args, function(element, index, list) {
		if(index>3) {
			var a = element.split('=');
			if(!a[1]) {
				logger.error('You must specify argument values with =, for example platform=ios or tall=true');
				process.exit(1);
			}
			if(a[0]==='tiversion') {
				a[0] = 'sdk';
			}
			newArgs = newArgs.concat(['--'+a[0], a[1]]);
		}
	});
	if(newArgs.indexOf('--platform') === -1) {
		newArgs = newArgs.concat(['--platform', (IS_OSX ? 'ios' : 'android')]);
	}

	//run stdout/stderr back through console.log
	var runcmd = spawn('titanium' + (IS_WIN ? '.cmd' : ''), newArgs);
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
		fs.removeSync(harnessAppPath);
		fs.mkdirpSync(harnessAppPath);
		chmodr.sync(harnessAppPath, 0777);
		fs.copySync(harnessTemplatePath, harnessAppPath);
	});

	desc('compile the example app in the given directory name and stage for launch, e.g. "jake app:setup dir=masterdetail"');
	task('setup', ['app:clobber'], function() {
		log('Initializing Alloy project...');
		if (!path.existsSync(resourcesPath)) {
			fs.mkdirpSync(resourcesPath);
			chmodr.sync(resourcesPath, 0777);
		}
		require('child_process').exec('alloy new -f "' + harnessAppPath + '"', function(error, stdout, stderr) {
			if (error) {
				console.log(stdout);
				console.log(stderr);
				console.log(error);
				process.exit(1);
			} else {
				log('Staging sample app "'+appDir+'" for launch...');
				fs.copySync(path.join(process.cwd(), 'test', 'apps', appDir), targetAppPath, {preserveTimestamps:true});
				fs.mkdirpSync(path.join(targetAppPath,'lib'));
				chmodr.sync(path.join(targetAppPath,'lib'), 0777);
				fs.copySync(
					path.join('test','lib'),
					path.join(targetAppPath,'lib'),
					{preserveTimestamps:true}
				);
				fs.unlinkSync(path.join(targetAppPath,'lib','testUtils.js'));
			}
		});
	});

	desc('run an example, all but dir are optional: e.g. "jake app:run dir=masterdetail platform=android tiversion=2.0.2.GA tisdk=<path to sdk>"');
	task('run', ['app:setup'], function() {
		runApp();
	});

	desc('copy a sample app\'s "app" folder into the Harness');
	task('quickrun', function() {
		log('Quick-running sample app "' + appDir + '"...');
		log('Staging sample app "' + appDir + '" for launch...');
		fs.copySync(path.join(process.cwd(), 'test', 'apps', appDir), targetAppPath, {preserveTimestamps:true});
		runApp();
	});

	desc('compiles the example app, minus the index.xml & index.tss files');
	task('setupNoXML', ['app:clobber'], function() {
		log('Initializing Alloy project...');
		if (!path.existsSync(resourcesPath)) {
			fs.mkdirpSync(resourcesPath);
			chmodr.sync(resourcesPath, 0777);
		}
		require('child_process').exec('alloy new -f "' + harnessAppPath + '"', function(error, stdout, stderr) {
			if (error) {
				console.log(stdout);
				console.log(stderr);
				console.log(error);
				process.exit(1);
			} else {
				log('Staging sample app "'+appDir+'" for launch...');
				fs.copySync(path.join(process.cwd(), 'test', 'apps', appDir), targetAppPath, {preserveTimestamps:true});
				fs.mkdirpSync(path.join(targetAppPath,'lib'));
				chmodr.sync(path.join(targetAppPath,'lib'), 0777);
				fs.copySync(
					path.join('test','lib'),
					path.join(targetAppPath,'lib'),
					{preserveTimestamps:true}
				);
				fs.unlinkSync(path.join(targetAppPath,'lib','testUtils.js'));
        log('Removing index.xml & index.tss');
        fs.unlinkSync(path.join(targetAppPath,'views','index.xml'));
        fs.unlinkSync(path.join(targetAppPath,'styles','index.tss'));
			}
		});
	});

  desc('run an example without copying index.xml and index.tss, for ALOY-656');
  task('runNoXML', ['app:setupNoXML'], function () {
    runApp();
  });

});
