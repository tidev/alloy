var path = require('path'),
	fs = require('fs'),
	wrench = require('wrench'),
	_ = require('../../lib/alloy/underscore')._,
	U = require('../../utils'),
	CONST = require('../../common/constants'),
	logger = require('../../common/logger');

var BASE_ERR = 'Project creation failed. ';

module.exports = function(args, program) {
	var appDirs = ['controllers','styles','views','models','assets'];
	var types = ['VIEW','STYLE','CONTROLLER'];
	var paths = getPaths(args[0] || '.');

	// only overwrite existing app path if given the force option
	if (path.existsSync(paths.app)) {
		if (!program.force) {
			U.die(BASE_ERR + '"app" directory already exists at "' + paths.app + '"');
		} else {
			wrench.rmdirSyncRecursive(paths.app);
		}
	}
	wrench.mkdirSyncRecursive(paths.app, 0777);

	// add alloy-specific folders
	_.each(appDirs, function(dir) {
		wrench.mkdirSyncRecursive(path.join(paths.app,dir), 0777);
	});

	// add alloy default project files
	_.each(types, function(type) {
		var filename = CONST.NAME_DEFAULT + '.' + CONST.FILE_EXT[type];
		fs.writeFileSync(
			path.join(paths.app,CONST.DIR[type],filename),
			fs.readFileSync(path.join(paths.default,filename),'utf8')
		);
	});
	fs.writeFileSync(path.join(paths.app,'README'), fs.readFileSync(paths.readme,'utf8'));

	// TODO: ti.physicalSizeCategory - https://jira.appcelerator.org/browse/ALOY-209
	// handle any necessary alloy native modules
	wrench.copyDirSyncRecursive(paths.modules, paths.project, {preserve:true});
	U.tiapp.installModule(paths.project, {
		id: 'ti.physicalSizeCategory',
		platform: 'android',
		version: '1.0'
	});

	// create default config files and install compiler plugin
	writeConfigFile('alloy.jmk', paths);
	writeConfigFile('config.json', paths);
	installPlugin(paths);

	// copy Resources android, iphone, and mobileweb directories to assets
	U.copyFileSync(
		path.join(paths.template,'gitignore.txt'), 
		path.join(paths.project,'.gitignore')
	);
	_.each(['android','iphone','mobileweb'], function(dir) {
		var rDir = path.join(paths.Resources,dir);
		if (!path.existsSync(rDir)) {
			return;
		}

		var p = path.join(paths.app,'assets',dir);
		wrench.mkdirSyncRecursive(p, 0777);
		wrench.copyDirSyncRecursive(rDir, p);
	});
	
	logger.info('Generated new project at: ' + paths.app);
}

function getPaths(project) {
	var alloy = path.join(__dirname,'..', '..');
	var template = path.join(alloy,'template');
	var paths = {
		// alloy paths
		alloy: alloy,
		modules: path.join(alloy,'modules'),
		template: path.join(alloy,'template'),
		default: path.join(template,'default'),
		readme: path.join(template, 'README'),

		// project paths
		project: project,
		resources: path.join(project,'Resources')
	}

	// validate the existence of the paths
	_.each(paths, function(v,k) {
		if (!path.existsSync(v)) {
			U.die(BASE_ERR + '"' + v + '" not found.');
		}
	});

	// Added after validation, since they won't exist yet
	_.extend(paths, {
		app: path.join(paths.project,'app'),
		plugins: path.join(paths.project,'plugins')
	});

	return paths;
}

function writeConfigFile(name, paths) {
	var file = path.join(paths.template,name);
	if (!path.existsSync(file)) {
		U.die([
			BASE_ERR + 'Required template file "' + file + '" is missing.',
			'Your installation of Alloy may be incomplete or corrupt. Please try updating or reinstalling.'
		]);
	}

	try {
		fs.writeFileSync(path.join(paths.app,name), fs.readFileSync(file, 'utf8'));
	} catch (e) {
		U.die([
			(new Error).stack,
			BASE_ERR + 'Unable create "' + file + '".'
		]);
	}
}

function installPlugin(paths) {
	var file = 'plugin.py'
	var id = 'ti.alloy';
	var source = path.join(paths.alloy,'plugin',file);
	var dest = path.join(paths.project,'plugins',id);

	// create plugin path and add to project
	U.ensureDir(dest);
	dest = path.join(dest,file);
	U.copyFileSync(source, dest);

	// add the plugin to tiapp.xml
	U.tiapp.installPlugin(paths.project, {
		id: 'ti.alloy',
		version: '1.0'
	});

	logger.info('Deployed ti.alloy compiler plugin to ' + dest);
}

