var path = require('path'),	
	colors = require('colors'),
	fs = require('fs'),
	wrench = require('wrench'),
	util = require('util'),
	vm = require('vm'),
	jsp = require("../../uglify-js/uglify-js").parser,
	_ = require("../../lib/alloy/underscore")._,
	logger = require('../../common/logger'),
	CompilerMakeFile = require('./CompilerMakeFile'),
	U = require('../../utils'),
	CU = require('./compilerUtils'),
	CONST = require('../../common/constants');

var alloyRoot = path.join(__dirname,'..','..'),
	viewRegex = new RegExp('\\.' + CONST.FILE_EXT.VIEW + '$'),
	controllerRegex = new RegExp('\\.' + CONST.FILE_EXT.CONTROLLER + '$'),
	modelRegex = new RegExp('\\.' + CONST.FILE_EXT.MODEL + '$'),
	buildPlatform,
	compileConfig = {};

//////////////////////////////////////
////////// command function //////////
//////////////////////////////////////
module.exports = function(args, program) {
	var paths = U.getAndValidateProjectPaths(program.outputPath || args[0] || process.cwd());
	var alloyConfig = {},
		compilerMakeFile;

	// remove the project's Resources directory, as it will all 
	// be replaced by Alloy. Only do it if the "assets" path is 
	// properly prepared with the platform-specific folders.
	var cleanResources = true;
	_.each(CONST.PLATFORM_FOLDERS, function(platform) {
		if (path.existsSync(path.join(paths.resources,platform)) && 
			!path.existsSync(path.join(paths.assets,platform))) {
			logger.warn('"' + platform + '" folder found in "Resources", but not "app/assets". Not cleaning "Resources" folder...');
			cleanResources = false;
		}
	});
	if (cleanResources) {
		logger.debug('Cleaning "Resources" folder...');

		if (!path.existsSync(paths.resources)) {
			wrench.mkdirSyncRecursive(paths.resources,0777);
		} else {
			// delete everything out of each platform-specific folder
			_.each(CONST.PLATFORM_FOLDERS, function(p) {
				U.rmdirContents(path.join(paths.resources,p));
			});

			// delete everything else out of Resources, except Node ACS files
			var nodeAcsRegex = /^ti\.cloud\..+?\.js$/;
			U.rmdirContents(paths.resources, _.union(CONST.PLATFORM_FOLDERS,[nodeAcsRegex]));
		}
	}
	logger.debug('');

	// create generated controllers folder in resources 
	logger.debug('----- BASE RUNTIME FILES -----');
	U.installPlugin(path.join(alloyRoot,'..'), paths.project, true);
	U.copyAlloyDir(alloyRoot, 'lib', paths.resources); 
	wrench.mkdirSyncRecursive(path.join(paths.resourcesAlloy, CONST.DIR.COMPONENT), 0777);
	wrench.mkdirSyncRecursive(path.join(paths.resourcesAlloy, CONST.DIR.WIDGET), 0777);
	U.copyAlloyDir(paths.app, [CONST.DIR.ASSETS,CONST.DIR.LIB,'vendor'], paths.resources);
	logger.debug('');

	// update alloy.js with current Alloy version (Alloy.version)
	var aFile = path.join(paths.resources,'alloy.js');
	fs.writeFileSync(aFile, fs.readFileSync(aFile,'utf8') + '\nexports.version = "' + program._version + '";\n');

	// construct compiler config from command line config parameters
	if (program.config && _.isString(program.config)) {
		_.each(program.config.split(','), function(v) {
			var parts = v.split('=');
			alloyConfig[parts[0]] = parts[1];
		});
	}
	alloyConfig.deploytype = alloyConfig.deploytype || 'development';
	alloyConfig.beautify = alloyConfig.beautify || alloyConfig.deploytype === 'development';

	logger.debug('----- CONFIGURATION -----');
	_.each(alloyConfig, function(v,k) {
		if (k) {
			logger.debug(k + ' = ' + v);
		}
	});
	logger.debug('project path = ' + paths.project);
	logger.debug('app path = ' + paths.app);
	logger.debug('');

	// create compile config from paths and various alloy config files
	compilerMakeFile = new CompilerMakeFile();
	compileConfig = CU.createCompileConfig(paths.app, paths.project, alloyConfig);
	buildPlatform = compileConfig && compileConfig.alloyConfig && compileConfig.alloyConfig.platform ? compileConfig.alloyConfig.platform : null;

	// process project makefiles
	var alloyJMK = path.resolve(path.join(paths.app,"alloy.jmk"));
	if (path.existsSync(alloyJMK)) {
		logger.debug('Loading "alloy.jmk" compiler hooks...');
		var script = vm.createScript(fs.readFileSync(alloyJMK), 'alloy.jmk');
		
		// process alloy.jmk compile file
		try {
			script.runInNewContext(compilerMakeFile);
			compilerMakeFile.isActive = true;
		} catch(e) {
			logger.error(e.stack);
			U.die('Project build at "' + alloyJMK.yellow + '" generated an error during load.');
		}

		compilerMakeFile.trigger("pre:compile",_.clone(compileConfig));
		logger.debug('');
	}

	// TODO: ti.physicalSizeCategory - https://jira.appcelerator.org/browse/ALOY-209
	if (!path.existsSync(path.join(paths.project,'ti.physicalSizeCategory-android-1.0.zip')) && 
		!path.existsSync(path.join(paths.project,'modules','android','ti.physicalsizecategory','1.0','timodule.xml'))) {
		wrench.copyDirSyncRecursive(path.join(alloyRoot,'modules'), paths.project, {preserve:true})
	}
	U.tiapp.installModule(paths.project, {
		id: 'ti.physicalSizeCategory',
		platform: 'android',
		version: '1.0'
	});

	// create the global style, if it exists
	logger.debug('----- MVC GENERATION -----');
	loadGlobalStyle(path.join(paths.app,CONST.DIR.STYLE,CONST.GLOBAL_STYLE));
	
	// Process all models
	var models = processModels();

	// create a regex for determining which platform-specific
	// folders should be used in the compile process
	var filteredPlatforms = _.reject(CONST.PLATFORM_FOLDERS_ALLOY, function(p) { return p === buildPlatform; });
	filteredPlatforms = _.map(filteredPlatforms, function(p) { return p + '[\\\\\\/]'; });
	var filterRegex = new RegExp('^(?:(?!' + filteredPlatforms.join('|') + '))');

	// Process all views, including all those belonging to widgets
	var viewCollection = U.getWidgetDirectories(paths.project, paths.app);
	viewCollection.push({ dir: path.join(paths.project,CONST.ALLOY_DIR) });
	_.each(viewCollection, function(collection) {
		// generate runtime controllers from views
		_.each(wrench.readdirSyncRecursive(path.join(collection.dir,CONST.DIR.VIEW)), function(view) {
			if (viewRegex.test(view) && filterRegex.test(view)) {
				// Make sure this view isn't already generated
				if (CU.componentExists(view, collection.manifest)) {
					// logger.debug('- Skipping "' + view + '", already processed...');
					return;
				}

				// generate runtime controller
				logger.debug('[' + view + '] ' + (collection.manifest ? collection.manifest.id + ' ' : '') + 'view processing...');
				parseAlloyComponent(view, collection.dir, collection.manifest);
			}
		});

		// generate runtime controllers from any controller code that has no 
		// corresponding view markup
		_.each(wrench.readdirSyncRecursive(path.join(collection.dir,CONST.DIR.CONTROLLER)), function(controller) {
			if (controllerRegex.test(controller) && filterRegex.test(controller)) {
				// Make sure this controller isn't already generated
				if (CU.componentExists(controller, collection.manifest)) {
					// logger.debug('- Skipping "' + view + '", already processed...');
					return;
				}

				logger.debug('[' + controller + '] ' + (collection.manifest ? collection.manifest.id + ' ' : '') + 'controller processing...');
				parseAlloyComponent(controller, collection.dir, collection.manifest, true);
			}
		});
	});
	logger.debug('');

	// generate app.js
	var alloyJsPath = path.join(paths.app,'alloy.js');
	var alloyJs = path.existsSync(alloyJsPath) ? fs.readFileSync(alloyJsPath,'utf8') : '';
	var appJS = path.join(compileConfig.dir.resources,"app.js");
	var code = _.template(
		fs.readFileSync(path.join(alloyRoot,'template','app.js'),'utf8'),
		{alloyJs:alloyJs}
	);

	// trigger our custom compiler makefile
	var njs = compilerMakeFile.trigger("compile:app.js",_.extend(_.clone(compileConfig), {"code":code, "appJSFile" : path.resolve(appJS)}));
	if (njs) {
		code = njs;
	}
	fs.writeFileSync(appJS,code);
	logger.info("compiling alloy to " + appJS.yellow);

	// optimize code
	optimizeCompiledCode(alloyConfig, paths);

	// trigger our custom compiler makefile
	if (compilerMakeFile.isActive) {
		compilerMakeFile.trigger("post:compile",_.clone(compileConfig));
	}
};


///////////////////////////////////////
////////// private functions //////////
///////////////////////////////////////
function parseAlloyComponent(view,dir,manifest,noView) {
	var parseType = noView ? 'controller' : 'view';

	// validate parameters
	if (!view) { U.die('Undefined ' + parseType + ' passed to parseAlloyComponent()'); }
	if (!dir) { U.die('Failed to parse ' + parseType + ' "' + view + '", no directory given'); }

	var basename = path.basename(view, '.' + CONST.FILE_EXT[parseType.toUpperCase()]);
		dirname = path.dirname(view).replace(/^(?:android|ios|mobileweb)[\\\/]*/,''),
		viewName = basename,
		template = {
			viewCode: '',
			controllerCode: '',
			exportsCode: '',
			WPATH: !manifest ? '' : _.template(fs.readFileSync(path.join(alloyRoot,'template','wpath.js'),'utf8'),{WIDGETID:manifest.id})
		},
		widgetDir = dirname ? path.join(CONST.DIR.COMPONENT,dirname) : CONST.DIR.COMPONENT,
		state = { parent: {} },
		files = {};

	// create a list of file paths
	searchPaths = noView ? ['CONTROLLER'] : ['VIEW','STYLE','CONTROLLER'];
	_.each(searchPaths, function(fileType) {
		// get the path values for the file
		var fileTypeRoot = path.join(dir,CONST.DIR[fileType]);
		var filename = viewName+'.'+CONST.FILE_EXT[fileType];
		var filepath = dirname ? path.join(dirname,filename) : filename;

		// check for platform-specific versions of the file
		var baseFile = path.join(fileTypeRoot,filepath);
		if (buildPlatform) {
			var platformSpecificFile = path.join(fileTypeRoot,buildPlatform,filepath);
			if (path.existsSync(platformSpecificFile)) {
				files[fileType] = platformSpecificFile;
				return;
			}
		}
		files[fileType] = baseFile;
	});
	files.COMPONENT = path.join(compileConfig.dir.resourcesAlloy,CONST.DIR.COMPONENT);
	if (dirname) { files.COMPONENT = path.join(files.COMPONENT,dirname); }
	files.COMPONENT = path.join(files.COMPONENT,viewName+'.js');

	// we are processing a view, not just a controller
	if (!noView) {
		// validate view
		if (!path.existsSync(files.VIEW)) {
			logger.warn('No ' + CONST.FILE_EXT.VIEW + ' view file found for view ' + files.VIEW);
			return;
		}

		// Load the style and update the state
		if (path.existsSync(files.STYLE)) {
			logger.debug('  style:      "' + path.relative(path.join(dir,CONST.DIR.STYLE),files.STYLE) + '"');
		}
		state.styles = CU.loadAndSortStyle(files.STYLE,manifest);

		// Load view from file into an XML document root node
		try {
			logger.debug('  view:       "' + path.relative(path.join(dir,CONST.DIR.VIEW),files.VIEW)+ '"');
			var docRoot = U.XML.getAlloyFromFile(files.VIEW);
		} catch (e) {
			U.die([
				e.stack,
				'Error parsing XML for view "' + view + '"'
			]);
		}

		// make sure we have a Window, TabGroup, or SplitWindow  
		var rootChildren = U.XML.getElementsFromNodes(docRoot.childNodes);
		if (viewName === 'index') {
			valid = [
				'Ti.UI.Window',
				'Ti.UI.iPad.SplitWindow',
				'Ti.UI.TabGroup'
			];
			_.each(rootChildren, function(node) {
				var found = true;
				var args = CU.getParserArgs(node, {}, { doSetId: false });

				if (args.fullname === 'Alloy.Require') {
					var inspect = CU.inspectRequireNode(node);
					for (var j = 0; j < inspect.names.length; j++) {
						if (!_.contains(valid, inspect.names[j])) {
							found = false;
							break;
						}
					}
				} else {
					found = _.contains(valid, args.fullname);
				}

				if (!found) {
					U.die([
						'Compile failed. index.xml must have a top-level container element.',
						'Valid elements: [ Window, TabGroup, SplitWindow]'
					]);
				}
			});
		}

		// Generate each node in the view
		_.each(rootChildren, function(node, i) {
			var defaultId = i === 0 ? viewName : undefined;
			template.viewCode += CU.generateNode(node, state, defaultId, true);
		});
	}

	// process the controller code
	if (path.existsSync(files.CONTROLLER)) {
		logger.debug('  controller: "' + path.relative(path.join(dir,CONST.DIR.CONTROLLER),files.CONTROLLER) + '"');
	}
	var cCode = CU.loadController(files.CONTROLLER);
	template.parentController = (cCode.parentControllerName != '') ? cCode.parentControllerName : "'BaseController'";
	template.controllerCode += cCode.controller;
	template.exportsCode += cCode.exports;

	// create generated controller module code for this view/controller or widget
	var code = _.template(fs.readFileSync(path.join(compileConfig.dir.template, 'component.js'), 'utf8'), template);

	// Write the view or widget to its runtime file
	if (manifest) {
		wrench.mkdirSyncRecursive(path.join(compileConfig.dir.resourcesAlloy, CONST.DIR.WIDGET, manifest.id, widgetDir), 0777);
		CU.copyWidgetResources(
			[path.join(dir,CONST.DIR.ASSETS), path.join(dir,CONST.DIR.LIB)], 
			compileConfig.dir.resources, 
			manifest.id
		);
		fs.writeFileSync(path.join(compileConfig.dir.resourcesAlloy, CONST.DIR.WIDGET, manifest.id, widgetDir, viewName + '.js'), code);
	} else {
		wrench.mkdirSyncRecursive(path.dirname(files.COMPONENT), 0777);
		fs.writeFileSync(files.COMPONENT, code);
	}
}

function findModelMigrations(name) {
	try {
		var migrationsDir = compileConfig.dir.migrations;
		var files = fs.readdirSync(migrationsDir);
		var part = '_'+name+'.'+CONST.FILE_EXT.MIGRATION;

		// look for our model
		files = _.reject(files,function(f) { return f.indexOf(part)==-1});
		
		// sort them in the oldest order first
		files = files.sort(function(a,b){
			var x = a.substring(0,a.length - part.length -1);
			var y = b.substring(0,b.length - part.length -1);
			if (x<y) return -1;
			if (x>y) return 1;
			return 0;
		});

		var codes = [];
		_.each(files,function(f) {
			var mf = path.join(migrationsDir,f);
			var m = fs.readFileSync(mf,'utf8');
			var code = "(function(migration){\n "+
			           "migration.name = '" + name + "';\n" + 
					   "migration.id = '" + f.substring(0,f.length-part.length).replace(/_/g,'') + "';\n" + 
						m + 
						"})";
			codes.push(code);
		});
		logger.info("Found " + codes.length + " migrations for model: "+name.yellow);
		return codes;
	} catch(E) {
		return [];
	}
}

function processModels() {
	var models = [];
	var modelRuntimeDir = path.join(compileConfig.dir.resourcesAlloy,'models');
	var modelTemplateFile = path.join(alloyRoot,'template','model.js');
	U.ensureDir(compileConfig.dir.models);

	// Make sure we havea runtime models directory
	var modelFiles = fs.readdirSync(compileConfig.dir.models);
	if (modelFiles.length > 0) {
		U.ensureDir(modelRuntimeDir);
	}

	// process each model
	_.each(modelFiles, function(modelFile) {
		if (!modelRegex.test(modelFile)) {
			logger.warn('Non-model file "' + modelFile + '" in models directory');
			return;
		}
		logger.debug('[' + modelFile + '] model processing...');

		var fullpath = path.join(compileConfig.dir.models,modelFile);
		var basename = path.basename(fullpath, '.'+CONST.FILE_EXT.MODEL);
		var modelJsFile = path.join(compileConfig.dir.models,basename+'.js');
		var modelJs = 'function(Model){}';

		// grab any additional model code from corresponding JS file, if it exists
		if (path.existsSync(modelJsFile)) {
			modelJs = fs.readFileSync(modelJsFile,'utf8');
		}

		// generate model code based on model.js template and migrations
		var code = _.template(fs.readFileSync(modelTemplateFile,'utf8'), {
			basename: basename,
			modelJs: modelJs,
			migrations: findModelMigrations(basename)
		});	

		// write the model to the runtime file
		var casedBasename = U.properCase(basename);
		fs.writeFileSync(path.join(modelRuntimeDir,casedBasename+'.js'), code);
		models.push(casedBasename);
	});

	return models;
};

function loadGlobalStyle(filepath) {
	if (path.existsSync(filepath)) {
		logger.debug('[app.tss] global style processing...');
		compileConfig.globalStyle = CU.loadStyle(filepath);
	}
}

function optimizeCompiledCode() {
	var mods = [
			'builtins',
			'mangle',
			'squeeze'
		],
		modLocation = './ast/';
		report = {};

	function getJsFiles() {
		return _.filter(wrench.readdirSyncRecursive(compileConfig.dir.resources), function(f) {
			return /\.js\s*$/.test(f);
		});
	}

	var lastFiles = [], 
		files;

	while((files = _.difference(getJsFiles(),lastFiles)).length > 0) {
		_.each(files, function(file) {
			// generate AST from file
			var fullpath = path.join(compileConfig.dir.resources,file);
			logger.debug('Parsing AST for "' + file + '"...');
			try {
				var ast = jsp.parse(fs.readFileSync(fullpath,'utf8'));
			} catch (e) {
				U.die('Error generating AST for "' + fullpath + '"', e);
			}

			// process all AST operations
			_.each(mods, function(mod) {
				logger.debug('- Processing "' + mod + '" module...')
				ast = require(modLocation+mod).process(ast, compileConfig, report) || ast;
			});
			fs.writeFileSync(fullpath, CU.generateCode(ast));
		});

		// Combine lastFiles and files, so on the next iteration we can make sure that the 
		// list of files to be processed has not grown, like in the case of builtins.
		lastFiles = _.union(lastFiles, files);
	}
}