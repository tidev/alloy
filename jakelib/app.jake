var fs = require('fs'),
	path = require('path'),
	wrench = require('wrench'),
	spawn = require('child_process').spawn,
	titanium = require('../Alloy/common/titanium'),
	harnessAppPath = path.join(process.cwd(),'test','projects','Harness')
	targetAppPath = path.join(harnessAppPath,'app'),
	resourcesPath = path.join(harnessAppPath,'Resources'),
	alloyLibPath = path.join(resourcesPath,'alloy'),
	vendorPath = path.join(resourcesPath,'vendor'),
	assetsPath = path.join(resourcesPath,'assets');

namespace('app', function() {
	desc('remove the contents of the test harness\' "app" directory');
	task('clobber', function() {
		console.log('Deleting Alloy app directory...');
		wrench.rmdirSyncRecursive(targetAppPath, true);
		console.log('Deleting runtime alloy directory...');
		wrench.rmdirSyncRecursive(alloyLibPath, true);
		console.log('Deleting runtime vendor directory...');
		wrench.rmdirSyncRecursive(vendorPath, true);
		console.log('Deleting runtime assets directory...');
		wrench.rmdirSyncRecursive(assetsPath, true);
		console.log('Creating empty app path at ' + targetAppPath);
		fs.mkdirSync(targetAppPath);
	});
	
	desc('compile the example app in the given directory name and stage for launch, e.g. "jake app:setup dir=masterdetail"');
	task('setup', ['app:clobber'], function() {

		console.log('Staging sample app "'+process.env.dir+'" for launch...');
		wrench.copyDirSyncRecursive(path.join(process.cwd(), 'test', 'apps', process.env.dir), targetAppPath);
	});
	
	desc('run an example, all but dir are optional: e.g. "jake app:run dir=masterdetail platform=android tiversion=2.0.2.GA tisdk=<path to sdk>"');
	task('run', ['app:setup'], function() {		
		console.log('Running sample app "'+process.env.dir+'"...');
		var p = titanium.run(harnessAppPath, process.env.platform, process.env.tiversion, process.env.tisdk);
	});
});
