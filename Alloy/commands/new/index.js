var path = require('path'),
	fs = require('fs'),
	wrench = require('wrench'),
	DOMParser = require("xmldom").DOMParser,
	XMLSerializer = require("xmldom").XMLSerializer,
	_ = require('../../lib/alloy/underscore')._,
	U = require('../../utils'),
	CONST = require('../../common/constants'),
	logger = require('../../common/logger'),
	alloyRoot = path.join(__dirname,'..', '..');

function createPlugin(rootDir) {
	var plugins = path.join(rootDir,"plugins");
	U.ensureDir(plugins);
	
	var alloyPluginDir = path.join(plugins,"ti.alloy");
	U.ensureDir(alloyPluginDir);
	
	var alloyPlugin = path.join(alloyPluginDir,"plugin.py");
	var pi = path.join(alloyRoot,"plugin","plugin.py");
	
	U.copyFileSync(pi,alloyPlugin);
	logger.info('Deployed ti.alloy plugin to '+alloyPlugin);
}

function newproject(args, program) {
	var dirs = ['controllers','styles','views','models','assets'],
		templateDir = path.join(alloyRoot,'template'),
		defaultDir = path.join(templateDir,'default'),
		INDEX_XML  = fs.readFileSync(path.join(defaultDir,'index.'+CONST.FILE_EXT.VIEW),'utf8'),
		INDEX_JSON = fs.readFileSync(path.join(defaultDir,'index.'+CONST.FILE_EXT.STYLE),'utf8'),
		INDEX_C    = fs.readFileSync(path.join(defaultDir,'index.'+CONST.FILE_EXT.CONTROLLER),'utf8'),
		README     = fs.readFileSync(path.join(templateDir, 'README'),'utf8'),
		projectPath, appPath, resourcesPath, tmpPath, alloyJmkTemplate; //, cfg;

	// validate args
	if (!_.isArray(args) || args.length === 0) {
		args[0] = '.';
	}

	// get app path, create if necessary
	projectPath = args[0];
	appPath = path.join(projectPath,'app');
	resourcesPath = path.join(projectPath,'Resources');
	if (path.existsSync(appPath)) {
		if (!program.force) {
			U.die("Directory already exists at: " + appPath);
		} else {
			wrench.rmdirSyncRecursive(appPath);
		}
	}
	wrench.mkdirSyncRecursive(appPath, 0777);
	
	// create alloy app directories
	for (var c = 0; c < dirs.length; c++) {
		tmpPath = path.join(appPath, dirs[c]);
		if (!path.existsSync(tmpPath)) {
			wrench.mkdirSyncRecursive(tmpPath, 0777);
		}
	}
	
	// create default view, controller, style, and config. 
	fs.writeFileSync(path.join(appPath,'views','index.'+CONST.FILE_EXT.VIEW),INDEX_XML,'utf-8');
	fs.writeFileSync(path.join(appPath,'styles','index.'+CONST.FILE_EXT.STYLE),INDEX_JSON,'utf-8');
	fs.writeFileSync(path.join(appPath,'controllers','index.'+CONST.FILE_EXT.CONTROLLER),INDEX_C,'utf-8');
	fs.writeFileSync(path.join(appPath,'README'),README,'utf-8');

	// copy in any modules
	wrench.copyDirSyncRecursive(path.join(alloyRoot,'modules'), projectPath, {preserve:true});

	// TODO: ti.physicalSizeCategory - https://jira.appcelerator.org/browse/ALOY-209
	U.tiapp.installModule(projectPath, {
		id: 'ti.physicalSizeCategory',
		platform: 'android',
		version: '1.0'
	});

	function writeConfigFile(name) {
		var templateFile = path.join(templateDir,name);
		if (!path.existsSync(templateFile)) {
			U.die([
				(new Error).stack,
				'Project creation failed. Required template file "' + name + '" is missing.',
				'Your installation of Alloy may be incomplete or corrupt. Please try updating or reinstalling.'
			]);
		}

		try {
			fs.writeFileSync(
				path.join(appPath,name), 
				fs.readFileSync(templateFile, 'utf8')
			);
		} catch (e) {
			U.die([
				(new Error).stack,
				'Project creation failed. Unable create "' + name + '" file'
			]);
		}
	}

	writeConfigFile('alloy.jmk');
	writeConfigFile('config.json');
	createPlugin(projectPath);
	U.tiapp.installPlugin(projectPath, {
		id: 'ti.alloy',
		version: '1.0'
	});

	// copy original android, iphone, and mobileweb directories to assets
	_.each(['android','iphone','mobileweb'], function(dir) {
		var rDir = path.join(resourcesPath,dir);
		if (!path.existsSync(rDir)) {
			return;
		}

		var p = path.join(appPath,'assets',dir);
		wrench.mkdirSyncRecursive(p, 0777);
		wrench.copyDirSyncRecursive(path.join(resourcesPath,dir), p);
	});
	
	logger.info('Generated new project at: ' + appPath);
}

module.exports = newproject;