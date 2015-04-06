var path = require('path'),
	fs = require('fs'),
	wrench = require('wrench'),
	_ = require('../../lib/alloy/underscore')._,
	U = require('../../utils'),
	CONST = require('../../common/constants'),
	logger = require('../../logger');

var BASE_ERR = 'Project creation failed. ';
var platformsDir = path.join(__dirname,'..','..','..','platforms');

var test_apps_folder = (process.platform === 'win32') ?
	path.join(process.env.APPDATA, 'npm', 'node_modules', 'alloy', 'test', 'apps') :
	path.join(process.execPath, '..', '..', 'lib', 'node_modules', 'alloy', 'test', 'apps');

module.exports = function(args, program) {
	var appDirs = ['controllers','styles','views','models','assets'];
	var templateName = args[1] || 'default';
	var paths = getPaths(args[0] || '.', templateName, program.testapp);

	// only overwrite existing app path if given the force option
	if (path.existsSync(paths.app)) {
		if (!program.force) {
			U.die(BASE_ERR + '"app" directory already exists at "' + paths.app + '"');
		} else {
			wrench.rmdirSyncRecursive(paths.app, true);
		}
	}
	wrench.mkdirSyncRecursive(paths.app, 0755);

	// copy platform-specific folders from Resources to app/assets
	_.each(CONST.PLATFORM_FOLDERS, function(platform) {
		var rPath = path.join(paths.resources,platform);
		if (path.existsSync(rPath)) {
			var aPath = path.join(paths.app,CONST.DIR.ASSETS,platform);
			wrench.mkdirSyncRecursive(aPath, 0755);
			wrench.copyDirSyncRecursive(rPath,aPath,{preserve:true});
		}
	});

	// add alloy-specific folders
	_.each(appDirs, function(dir) {
		wrench.mkdirSyncRecursive(path.join(paths.app,dir), 0755);
	});

	// add the default alloy.js file
	U.copyFileSync(path.join(paths.template,'alloy.js'), path.join(paths.app,'alloy.js'));

	// install ti.alloy compiler plugin
	U.installPlugin(path.join(paths.alloy,'..'), paths.project);

	// add the default app.tss file
	U.copyFileSync(path.join(paths.template,CONST.GLOBAL_STYLE), path.join(paths.app,CONST.DIR.STYLE,CONST.GLOBAL_STYLE));

	// copy Resources platform-specific directories to assets
	U.copyFileSync(
		path.join(paths.template,'gitignore.txt'),
		path.join(paths.project,'.gitignore')
	);
	_.each(CONST.PLATFORM_FOLDERS, function(dir) {
		var rDir = path.join(paths.resources,dir);
		if (!path.existsSync(rDir)) {
			return;
		}

		var p = path.join(paths.app,'assets',dir);
		wrench.mkdirSyncRecursive(p, 0755);
		wrench.copyDirSyncRecursive(rDir, p);
	});

	// copy in any Alloy-specific Resources files
	// wrench.copyDirSyncRecursive(paths.alloyResources,paths.assets,{preserve:true});
	_.each(CONST.PLATFORMS, function(p) {
		var platformInResources = (p === 'ios') ? path.join(paths.resources, 'iphone') : path.join(paths.resources, p);

		// only copy the resource files for supported platforms
		if (path.existsSync(platformInResources)) {
			wrench.copyDirSyncRecursive(
				path.join(platformsDir, p, 'project'),
				paths.project,
				{ preserve:true }
			);
		}
	});

	// add alloy project template files
	var tplPath = (!program.testapp) ? path.join(paths.projectTemplate,'app') : paths.projectTemplate;
	wrench.copyDirSyncRecursive(tplPath, paths.app, {preserve:true});
	fs.writeFileSync(path.join(paths.app,'README'), fs.readFileSync(paths.readme,'utf8'));

	// if creating from one of the test apps...
	if(program.testapp) {
		// remove _generated folder,
		// TODO: once we update wrench (ALOY-1001), add an exclude regex to the
		// copyDirSynRecursive() statements above rather than deleting the folder here
		wrench.rmdirSyncRecursive(path.join(paths.app,'_generated'), true);
		if(path.existsSync(path.join(test_apps_folder, program.testapp, 'specs'))) {
			// copy in the test harness
			wrench.mkdirSyncRecursive(path.join(paths.app,'lib'), 0755);
			wrench.copyDirSyncRecursive(path.join(path.resolve(test_apps_folder, '..'), 'lib'), path.join(paths.app, 'lib'), {preserve:true});
		}
	}

	// delete the build folder to give us a fresh run
	wrench.rmdirSyncRecursive(paths.build, true);

	logger.info('Generated new project at: ' + paths.app);
};

function getPaths(project, templateName, testapp) {
	var alloy = path.join(__dirname,'..', '..');
	var template = path.join(alloy,'template');
	var projectTemplates = path.join(alloy,'..','templates');

	var paths = {
		// alloy paths
		alloy: alloy,
		template: path.join(alloy,'template'),
		readme: path.join(template, 'README'),
		projectTemplate: (!testapp) ? path.join(projectTemplates,templateName) :
		path.join(test_apps_folder, testapp),

		// project paths
		project: project,
		resources: path.join(project,'Resources'),
		build: path.join(project,'build')
	};

	// validate the existence of the paths
	_.each(paths, function(v,k) {
		if (!path.existsSync(v)) {
			var errs = [BASE_ERR];
			switch(k) {
				case 'build':
					// skip
					return;
				case 'projectTemplate':
					var error = (!testapp) ? 'Project template "' + templateName : 'Test app "' + testapp;
					errs.push(error + '" not found at "' + v + '"');
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
		assets: path.join(paths.project,'app','assets'),
		plugins: path.join(paths.project,'plugins')
	});

	return paths;
}
