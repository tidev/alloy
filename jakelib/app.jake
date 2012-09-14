var fs = require('fs'),
	path = require('path'),
	wrench = require('wrench'),
	spawn = require('child_process').spawn,
	titanium = require('../Alloy/common/titanium'),
	harnessTemplatePath = path.join(process.cwd(),'test','projects','HarnessTemplate'),
	harnessAppPath = path.join(process.cwd(),'test','projects','Harness'),
	targetAppPath = path.join(harnessAppPath,'app'),
	resourcesPath = path.join(harnessAppPath,'Resources'),
	appsTemplatePath = path.join(process.cwd(),'test','apps','_template');

namespace('app', function() {
	desc('remove the contents of the test harness\' "app" directory');
	task('clobber', function() {
		console.log('Reseting the Harness app from template...');
		wrench.rmdirSyncRecursive(harnessAppPath, true);
		wrench.mkdirSyncRecursive(harnessAppPath, 0777);
		wrench.copyDirSyncRecursive(harnessTemplatePath, harnessAppPath);
	});
	
	desc('compile the example app in the given directory name and stage for launch, e.g. "jake app:setup dir=masterdetail"');
	task('setup', ['app:clobber'], function() {
		console.log('Initializing Alloy project...');
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
				console.log('Staging sample app "'+process.env.dir+'" for launch...');
				wrench.copyDirSyncRecursive(appsTemplatePath, targetAppPath, {preserve:true});
				wrench.copyDirSyncRecursive(path.join(process.cwd(), 'test', 'apps', process.env.dir), targetAppPath, {preserve:true});
			}
		});
	});
	
	desc('run an example, all but dir are optional: e.g. "jake app:run dir=masterdetail platform=android tiversion=2.0.2.GA tisdk=<path to sdk>"');
	task('run', ['app:setup'], function() {		
		console.log('Running sample app "'+process.env.dir+'"...');
		var p = titanium.run(harnessAppPath, process.env.platform, process.env.tiversion, process.env.tisdk);
	});
});
