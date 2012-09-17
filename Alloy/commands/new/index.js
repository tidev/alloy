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
	var templateName = args[1] || 'default';
	var paths = getPaths(args[0] || '.', templateName);

	// only overwrite existing app path if given the force option
	if (path.existsSync(paths.app)) {
		if (!program.force) {
			U.die(BASE_ERR + '"app" directory already exists at "' + paths.app + '"');
		} else {
			wrench.rmdirSyncRecursive(paths.app);
		}
	}
	wrench.mkdirSyncRecursive(paths.app, 0777);

	// copy platform-specific folders from Resources to app/assets
	_.each(CONST.PLATFORM_FOLDERS, function(platform) {
		var rPath = path.join(paths.resources,platform);
		if (path.existsSync(rPath)) {
			var aPath = path.join(paths.app,CONST.DIR.ASSETS,platform);
			wrench.mkdirSyncRecursive(aPath, 0777);
			wrench.copyDirSyncRecursive(rPath,aPath,{preserve:true});
		}
	});

	// add alloy-specific folders
	_.each(appDirs, function(dir) {
		wrench.mkdirSyncRecursive(path.join(paths.app,dir), 0777);
	});

	// add alloy project template files
	wrench.copyDirSyncRecursive(paths.projectTemplate, paths.project, {preserve:true});
	fs.writeFileSync(path.join(paths.app,'README'), fs.readFileSync(paths.readme,'utf8'));

	// TODO: ti.physicalSizeCategory - https://jira.appcelerator.org/browse/ALOY-209
	// handle any necessary alloy native modules
	wrench.copyDirSyncRecursive(paths.modules, paths.project, {preserve:true});
	U.tiapp.installModule(paths.project, {
		id: 'ti.physicalSizeCategory',
		platform: 'android',
		version: '1.0'
	});

	// install ti.alloy compiler plugin
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

function getPaths(project, templateName) {
	var alloy = path.join(__dirname,'..', '..');
	var template = path.join(alloy,'template');
	var projectTemplates = path.join(alloy,'..','templates');

	var paths = {
		// alloy paths
		alloy: alloy,
		modules: path.join(alloy,'modules'),
		template: path.join(alloy,'template'),
		readme: path.join(template, 'README'),
		projectTemplate: path.join(projectTemplates,templateName),

		// project paths
		project: project,
		resources: path.join(project,'Resources')
	}

	// validate the existence of the paths
	_.each(paths, function(v,k) {
		if (!path.existsSync(v)) {
			var errs = [BASE_ERR];
			switch(k) {
				case 'projectTemplate':
					errs.push('Project template "' + templateName + '" not found at "' + v + '"');
					break;
				case 'project':
					errs.push('Project path not found at "' + v + '"');
					break;
				default:
					errs.push('"' + v + '" not found.');
					break;
			}
			U.die(errs);
		}
	});

	// Added after validation, since they won't exist yet
	_.extend(paths, {
		app: path.join(paths.project,'app'),
		plugins: path.join(paths.project,'plugins')
	});

	return paths;
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

