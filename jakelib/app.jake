var fs = require('fs'),
	path = require('path'),
	wrench = require('wrench'),
	spawn = require('child_process').spawn,
	titanium = require('../Alloy/common/titanium'),
	harnessAppPath = path.join(process.cwd(),'test','projects','Harness')
	targetAppPath = path.join(process.cwd(),'test','projects','Harness','app'),
	alloyLibPath = path.join(process.cwd(),'test','projects','Harness','Resources','alloy');

namespace('app', function() {
	desc('remove the contents of the test harness\' "app" directory');
	task('clobber', function() {
		console.log('clobbering Alloy app directory...');
		if (path.existsSync(targetAppPath)) {
			wrench.rmdirSyncRecursive(targetAppPath);
		}
		if (path.existsSync(alloyLibPath)) {
			wrench.rmdirSyncRecursive(alloyLibPath);
		}
		fs.mkdirSync(targetAppPath);
	});
	
	desc('compile the example app in the given directory name and stage for launch, e.g. "jake app:setup dir=masterdetail"');
	task('setup', ['app:clobber'], function() {
		var templateDir = path.join(targetAppPath,'template');

		console.log('Staging sample app "'+process.env.dir+'" for launch...');
		wrench.copyDirSyncRecursive(path.join(process.cwd(), 'test', 'apps', process.env.dir), targetAppPath);

		console.log('Copying Alloy templates...');
		if (path.existsSync(templateDir)) {
			wrench.rmdirSyncRecursive(templateDir);
		}
		wrench.mkdirSyncRecursive(templateDir, 0777);
		wrench.copyDirSyncRecursive(path.join(process.cwd(), 'Alloy', 'template'), templateDir);
	});
	
	desc('run an example, all but dir are optional: e.g. "jake app:run dir=masterdetail platform=android tiversion=2.0.2.GA tisdk=<path to sdk>"');
	task('run', ['app:setup'], function() {		
		console.log('Running sample app "'+process.env.dir+'"...');
		var p = titanium.run(harnessAppPath, process.env.platform, process.env.tiversion, process.env.tisdk);
	});
});
