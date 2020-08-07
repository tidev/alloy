/*
	Converts a Classic Titanium project to an Alloy project.
	Run `alloy new [path]` for basic operation.

	As of Alloy 1.7, you can create an app from one of the testing
	apps by using:
	`alloy new [path] --testapp ui/tableview `
*/
var path = require('path'),
	fs = require('fs-extra'),
	chmodr = require('chmodr'),
	_ = require('lodash'),
	U = require('../../utils'),
	CONST = require('../../common/constants'),
	logger = require('../../logger'),
	https = require('https'),
	{ spawn } = require('child_process');

var BASE_ERR = 'Project creation failed. ';
var platformsDir = path.join(__dirname, '..', '..', '..', 'platforms');
var templatesDir = path.join(__dirname, '..', '..', '..', 'templates');
var sampleAppsDir = path.join(__dirname, '..', '..', '..', 'samples', 'apps');

module.exports = async function(args, program) {
	var appDirs = ['controllers', 'styles', 'views', 'models', 'assets'];
	var templateName = args[1] || 'default';
	var paths = getPaths(args[0] || '.', templateName, program.testapp);

	// only overwrite existing app path if given the force option
	if (fs.existsSync(paths.app)) {
		if (!program.force) {
			U.die(BASE_ERR + '"app" directory already exists at "' + paths.app + '"');
		} else {
			fs.removeSync(paths.app);
		}
	}
	fs.mkdirpSync(paths.app);
	chmodr.sync(paths.app, 0755);

	// copy platform-specific folders from Resources to app/assets
	_.each(CONST.PLATFORM_FOLDERS, function(platform) {
		var rPath = path.join(paths.resources, platform);
		if (fs.existsSync(rPath)) {
			var aPath = path.join(paths.app, CONST.DIR.ASSETS, platform);
			fs.mkdirpSync(aPath);
			chmodr.sync(aPath, 0755);
			fs.copySync(rPath, aPath, {preserveTimestamps:true});
		}
	});

	// add alloy-specific folders
	_.each(appDirs, function(dir) {
		fs.mkdirpSync(path.join(paths.app, dir));
		chmodr.sync(path.join(paths.app, dir), 0755);
	});

	// move existing i18n and platform directories into app directory
	['i18n', 'platform'].forEach(function (name) {
		var src = path.join(paths.project, name);
		if (fs.existsSync(src)) {
			fs.renameSync(src, path.join(paths.app, name));
		}
	});

	// add the default alloy.js file
	U.copyFileSync(path.join(paths.template, 'alloy.js'), path.join(paths.app, 'alloy.js'));

	// webpack builds don't require the alloy plugin
	if (!templateName.includes('webpack')) {
		// install ti.alloy compiler plugin
		U.installPlugin(path.join(paths.alloy, '..'), paths.project);
	}

	// replace the classic webpack plugin with the alloy one
	if (templateName.includes('webpack')) {
		let pkg = {
			devDependencies: { },
			scripts: { }
		};
		// if there is an existing package.json then we'll just update it, if not then we'll make a
		// best attempt to get a working project
		if (await fs.exists(paths.packageJson)) {
			pkg = await fs.readJSON(paths.packageJson);

			// Make sure the required stanzas exist in the package.json
			if (!pkg.dependencies) {
				pkg.dependencies = {};
			}

			if (!pkg.devDependencies) {
				pkg.devDependencies = {};
			}

			if (!pkg.scripts) {
				pkg.scripts = {};
			}

			// remove the classic plugin if it exists
			if (pkg.dependencies['@titanium-sdk/webpack-plugin-classic']) {
				delete pkg.dependencies['@titanium-sdk/webpack-plugin-classic'];
			}

			if (pkg.devDependencies['@titanium-sdk/webpack-plugin-classic']) {
				delete pkg.devDependencies['@titanium-sdk/webpack-plugin-classic'];
			}

		} else {
			logger.warn(`No package.json file exists in ${paths.project} so creating one`);
			logger.warn('Please visit https://github.com/appcelerator/webpack-plugin-alloy#readme to make sure your project is fully up to date');
			// specify this exact version of webpack as using a new version requires all things to be updated
			pkg.devDependencies.webpack = '^4.43.0';
			pkg.devDependencies.eslint = '^7.5.0';
			pkg.devDependencies['eslint-config-axway'] = '4.7.0';
			pkg.devDependencies['babel-eslint'] = '10.1.0';
			pkg.private = true;
		}

		const srcFolder = path.join(paths.project, 'src');
		if (await fs.exists(srcFolder)) {
			logger.info('Removing src folder');
			await fs.remove(srcFolder);
		}

		// add the required dependencies, checking for the latest version if possible
		Object.assign(pkg.devDependencies, {
			'@titanium-sdk/webpack-plugin-alloy': `^${await getLatestPackageVersion('@titanium-sdk/webpack-plugin-alloy', '0.2.1')}`,
			'@titanium-sdk/webpack-plugin-babel': `^${await getLatestPackageVersion('@titanium-sdk/webpack-plugin-babel', '0.1.2')}`,
			'alloy': `^${await getLatestPackageVersion('alloy', '1.15.0')}`,
			'alloy-compiler': `^${await getLatestPackageVersion('alloy-compiler', '0.2.4')}`,
			'eslint-plugin-alloy': `^${await getLatestPackageVersion('eslint-plugin-alloy', '1.1.1')}`
		});

		Object.assign(pkg.scripts, {
			lint: 'eslint app/'
		});

		await fs.writeJSON(paths.packageJson, pkg, { spaces: 2 });

		// If the template has a readme then read it in and append it to the existing README.md file,
		// if that file doesn't exist then it'll get created
		if (await fs.exists(paths.readme)) {
			const readmeContents = await fs.readFile(paths.readme);
			await fs.appendFile(paths.appReadme, `\n${readmeContents}`);
		}
	}

	// add the default app.tss file
	U.copyFileSync(path.join(paths.template, CONST.GLOBAL_STYLE), path.join(paths.app, CONST.DIR.STYLE, CONST.GLOBAL_STYLE));

	// copy DefaultIcon.png to project root
	fs.readdirSync(templatesDir).forEach(function (name) {
		if (/^DefaultIcon(\-\w+)?\.png$/.test(name)) {
			U.copyFileSync(path.join(templatesDir, name), path.join(paths.project, name));
		}
	});

	// copy Resources platform-specific directories to assets
	U.copyFileSync(
		path.join(paths.template, 'gitignore.txt'),
		path.join(paths.project, '.gitignore')
	);
	_.each(CONST.PLATFORM_FOLDERS, function(dir) {
		var rDir = path.join(paths.resources, dir);
		if (!fs.existsSync(rDir)) {
			return;
		}

		var p = path.join(paths.app, 'assets', dir);
		fs.mkdirpSync(p);
		chmodr.sync(p, 0755);
		fs.copySync(rDir, p);
	});

	// copy in any Alloy-specific Resources files
	// fs.copySync(paths.alloyResources,paths.assets,{preserveTimestamps:true});
	_.each(CONST.PLATFORMS, function(p) {
		var pDir = path.join(platformsDir, p, 'project');
		if (!fs.existsSync(pDir)) {
			return;
		}

		fs.copySync(
			pDir,
			paths.project,
			{preserveTimestamps:true}
		);
	});

	// add alloy project template files
	var tplPath = (!program.testapp) ? path.join(paths.projectTemplate, 'app') : paths.projectTemplate;
	fs.copySync(tplPath, paths.app, {preserveTimestamps:true});

	// Don't copy across the default README if it's a webpack project
	if (!templateName.includes('webpack')) {
		fs.writeFileSync(path.join(paths.app, 'README'), fs.readFileSync(paths.readme, 'utf8'));
	}


	// if creating from one of the test apps...
	if (program.testapp) {
		// remove _generated folder,
		// TODO: once we update wrench (ALOY-1001), add an exclude regex to the
		// copyDirSynRecursive() statements above rather than deleting the folder here
		fs.removeSync(path.join(paths.app, '_generated'));
		if (fs.existsSync(path.join(sampleAppsDir, program.testapp, 'specs'))) {
			// copy in the test harness
			fs.mkdirpSync(path.join(paths.app, 'lib'));
			chmodr.sync(path.join(paths.app, 'lib'), 0755);
			fs.copySync(path.join(path.resolve(sampleAppsDir, '..'), 'lib'), path.join(paths.app, 'lib'), {preserveTimestamps:true});
		}
	}

	// delete the build folder to give us a fresh run
	fs.removeSync(paths.build);

	if (templateName.includes('webpack')) {
		logger.info('Installing project dependencies');
		try {
			await installDependencies(paths.project, logger);
		} catch (error) {
			logger.error('Failed to install project dependencies');
			logger.error(error);
		}
	}

	if (await fs.exists(paths.eslintTemplate)) {
		await fs.copy(path.join(paths.eslintTemplate), path.join(paths.eslintApp));
	}

	// Copy across the settings.json to have VS Code hide certain directories
	const vscodeDir = path.join(paths.project, '.vscode');
	if (!await fs.exists(vscodeDir)) {
		await fs.ensureDir(vscodeDir);
	}

	await fs.copy(path.join(paths.template, 'settings.json'), path.join(vscodeDir, 'settings.json'));

	logger.info('Generated new project at: ' + paths.app);
};

function getPaths(project, templateName, testapp) {
	var alloy = path.join(__dirname, '..', '..');
	var template = path.join(alloy, 'template');
	var projectTemplates = path.join(alloy, '..', 'templates');
	var templateReadme = path.join(projectTemplates, templateName, 'README.md');
	var customTemplateDir;
	var customAppDir;
	var readMeFile;

	if (fs.existsSync(templateName) && !testapp) {
		customTemplateDir = templateName;
		customAppDir = path.join(templateName, 'app');
		readMeFile = path.join(customTemplateDir, 'README');
	} else if (fs.existsSync(templateReadme)) {
		readMeFile = templateReadme;
	}

	var paths = {
		// alloy paths
		alloy: alloy,
		template: path.join(alloy, 'template'),
		readme: fs.existsSync(readMeFile) ? readMeFile : path.join(template, 'README'),
		appTemplate: (!testapp) ? customAppDir || path.join(projectTemplates, templateName, 'app') : path.join(sampleAppsDir, testapp),
		projectTemplate: (!testapp) ? customTemplateDir || path.join(projectTemplates, templateName) : path.join(sampleAppsDir, testapp),

		// project paths
		project: project,
		resources: path.join(project, 'Resources'),
		build: path.join(project, 'build')
	};

	// validate the existence of the paths
	_.each(paths, function(v, k) {
		if (!fs.existsSync(v)) {
			var errs = [BASE_ERR];
			switch (k) {
				case 'build':
					// skip
					return;
				case 'projectTemplate':
					var projError = (!testapp) ? 'Project template "' + templateName : 'Test app "' + testapp;
					errs.push(projError + '" not found at "' + v + '"');
					break;
				case 'appTemplate':
					var appError = (!testapp) ? 'Application template "' + v : 'Test app "' + testapp;
					errs.push(appError + '" not found');
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
		app: path.join(paths.project, 'app'),
		assets: path.join(paths.project, 'app', 'assets'),
		plugins: path.join(paths.project, 'plugins'),
		packageJson: path.join(paths.project, 'package.json'),
		eslintTemplate: path.join(paths.appTemplate, 'eslintrc_js'),
		eslintApp: path.join(paths.project, '.eslintrc.js'),
		appReadme: path.join(paths.project, 'README.md')
	});

	return paths;
}

/**
 * Check what the "latest" dist-tag on npm is for the provided package, falling back to the
 * default version provided if the request errors
 *
 * @param {String} packageName - Name of the package to lookup
 * @param {String} defaultVersion - If the latest version can't be resolved, the version to fallback to
 *
 * @returns {Promise<String>} Either the latest version of the defaultVersion if the request errors
 */
async function getLatestPackageVersion (packageName, defaultVersion) {
	return new Promise((resolve) => {
		try {
			https.get(`https://registry.npmjs.org/-/package/${packageName}/dist-tags`, res => {
				if (res.statusCode === 200) {
					let body = '';
					res.on('data', data => body += data);
					res.on('end', () => {
						return resolve(JSON.parse(body).latest);
					});
				} else {
					return resolve(defaultVersion);
				}
			});
		} catch (error) {
			return resolve(defaultVersion);
		}
	});
}

/**
 * Runs "npm i" in the provided project directory, code is lifted from the post-create hook in the
 * angular project template
 *
 * @param {String} projectPath - path to the project
 */
async function installDependencies(projectPath) {
	let npmExecutable = 'npm';
	const spawnOptions = {
		cwd: projectPath,
		stdio: 'inherit'
	};
	if (process.platform === 'win32') {
		spawnOptions.shell = true;
		npmExecutable += '.cmd';
	}
	return new Promise((resolve, reject) => {
		const child = spawn(npmExecutable, [ 'i' ], spawnOptions);
		child.on('close', code => {
			if (code !== 0) {
				return reject(new Error('Failed to install project dependencies.'));
			}

			resolve();
		});
	});
}
