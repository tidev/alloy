var path = require('path'),	
	colors = require('colors'),
	fs = require('fs'),
	wrench = require('wrench'),
	util = require('util'),
	vm = require('vm'),
	jsonlint = require('jsonlint'),
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
	compileConfig = {},
	theme;

var times = {
	first: null,
	last: null,
	msgs: []
};

function tiSdkVersionNumber(tiVersion) {
	var parts = tiVersion.split && tiVersion.split('.');
	return parts[0]*100 + parts[1]*10 + parts[2]*1; // *1 is to cast it to an integer
}

//////////////////////////////////////
////////// command function //////////
//////////////////////////////////////
module.exports = function(args, program) {
//	BENCHMARK();
	var paths = U.getAndValidateProjectPaths(program.outputPath || args[0] || process.cwd());

	// Parse the tiapp.xml and make sure the sdk-version is at least 3.0.0
	var tiVersion = U.tiapp.getTitaniumSdkVersion(U.tiapp.parse(paths.project));
	if (tiVersion === null) {
		logger.warn('Unable to determine Titanium SDK version from tiapp.xml.');
		logger.warn('Your app may have unexpected behavior. Make sure your tiapp.xml is valid.');
	} else if (tiSdkVersionNumber(tiVersion) < tiSdkVersionNumber(CONST.MINIMUM_TI_SDK)) {
		logger.error('Alloy 1.0.0+ requires Titanium SDK ' + CONST.MINIMUM_TI_SDK + ' or higher.');
		logger.error('Version "' + tiVersion + '" was found in the "sdk-version" field of your tiapp.xml.');
		logger.error('If you are building with the old titanium.py script and are specifying an SDK version ');
		logger.error('as a CLI argument that is different than the one in your tiapp.xml, please change the');
		logger.error('version in your tiapp.xml file. ');
		process.exit(1);
	}

//	BENCHMARK('getAndValidateProjectPaths');
	var alloyConfig = {},
		compilerMakeFile;

	logger.debug('Cleaning "Resources/alloy/' + CONST.DIR.COMPONENT + '" folder...');
	U.rmdirContents(path.join(paths.resourcesAlloy,CONST.DIR.COMPONENT), ['BaseController.js']);

	logger.debug('Cleaning "Resources/alloy/' + CONST.DIR.MODEL + '" folder...');
	U.rmdirContents(path.join(paths.resourcesAlloy,CONST.DIR.MODEL));

	logger.debug('Cleaning "Resources/alloy/' + CONST.DIR.WIDGET + '" folder...');
	U.rmdirContents(path.join(paths.resourcesAlloy,CONST.DIR.WIDGET));
	logger.debug(' ');

	// GET RID OF ORPHAN FILES
	U.deleteOrphanFiles(
		paths.resources, 
		[
			path.join(alloyRoot,'lib'),
			path.join(paths.app,CONST.DIR.ASSETS),
			path.join(paths.app,CONST.DIR.LIB),
			path.join(paths.app,'vendor'),
		],
		[
			path.join('alloy','CFG.js'),
			path.join('alloy','widgets'),
			path.join('alloy','models')
		]
	);
	logger.trace(' ');

	// create generated controllers folder in resources 
	logger.debug('----- BASE RUNTIME FILES -----');
	U.installPlugin(path.join(alloyRoot,'..'), paths.project);
//	BENCHMARK('install Alloy plugins/hooks');

	// Copy in all assets, libs, and Alloy runtime files
	U.updateFiles(path.join(alloyRoot, 'lib'), paths.resources);
	wrench.mkdirSyncRecursive(path.join(paths.resourcesAlloy, CONST.DIR.COMPONENT), 0777);
	wrench.mkdirSyncRecursive(path.join(paths.resourcesAlloy, CONST.DIR.WIDGET), 0777);
	U.updateFiles(path.join(paths.app,CONST.DIR.ASSETS), paths.resources);
	U.updateFiles(path.join(paths.app,CONST.DIR.LIB), paths.resources);
	U.updateFiles(path.join(paths.app,'vendor'), paths.resources);
	logger.debug('');
//	BENCHMARK('Copy Alloy libs and assets into project');

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

	// create compile config from paths and various alloy config files
	compileConfig = CU.createCompileConfig(paths.app, paths.project, alloyConfig);
	buildPlatform = compileConfig.alloyConfig.platform;
	theme = compileConfig.theme;
	logger.debug('platform = ' + buildPlatform);
	logger.debug('theme = ' + theme);
//	BENCHMARK('generate Alloy configurations');

	// check theme for assets
	if (theme) {
		var themeAssetsPath = path.join(paths.app,'themes',theme,'assets');
		if (path.existsSync(themeAssetsPath)) {
			wrench.copyDirSyncRecursive(themeAssetsPath, paths.resources, {preserve:true});
		}
	}
	logger.debug('');
//	BENCHMARK('copy theme assets');

	// process project makefiles
	compilerMakeFile = new CompilerMakeFile();
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
//	BENCHMARK('process Alloy jmk file');

	// TODO: https://jira.appcelerator.org/browse/ALOY-477
	if (buildPlatform === 'android') {
		U.tiapp.upStackSizeForRhino(paths.project);
	}
//	BENCHMARK('install android modules and tiapp fixes');

	logger.debug('----- MVC GENERATION -----');

	// create the global style, if it exists
	loadGlobalStyles(paths.app, theme);
//	BENCHMARK('load global styles');
	
	// Process all models
	var models = processModels();
//	BENCHMARK('process models');

	// create a regex for determining which platform-specific
	// folders should be used in the compile process
	var filteredPlatforms = _.reject(CONST.PLATFORM_FOLDERS_ALLOY, function(p) { return p === buildPlatform; });
	filteredPlatforms = _.map(filteredPlatforms, function(p) { return p + '[\\\\\\/]'; });
	var filterRegex = new RegExp('^(?:(?!' + filteredPlatforms.join('|') + '))');

	// Process all views, including all those belonging to widgets
	var viewCollection = U.getWidgetDirectories(paths.project, paths.app);
	viewCollection.push({ dir: path.join(paths.project,CONST.ALLOY_DIR) });

	var tracker = {};
	_.each(viewCollection, function(collection) {
		// generate runtime controllers from views
		_.each(wrench.readdirSyncRecursive(path.join(collection.dir,CONST.DIR.VIEW)), function(view) {
			if (viewRegex.test(view) && filterRegex.test(view)) {
				// make sure this controller is only generated once
				var fp = path.join(collection.dir,view.substring(0,view.lastIndexOf('.')));
				if (tracker[fp]) { return; }

				// generate runtime controller
				logger.debug('[' + view + '] ' + (collection.manifest ? collection.manifest.id + ' ' : '') + 'view processing...');
				parseAlloyComponent(view, collection.dir, collection.manifest);
				tracker[fp] = true;
			}
		});

		// generate runtime controllers from any controller code that has no 
		// corresponding view markup
		_.each(wrench.readdirSyncRecursive(path.join(collection.dir,CONST.DIR.CONTROLLER)), function(controller) {
			if (controllerRegex.test(controller) && filterRegex.test(controller)) {
				// make sure this controller is only generated once
				var fp = path.join(collection.dir,controller.substring(0,controller.lastIndexOf('.')));
				if (tracker[fp]) { return; }

				// generate runtime controller
				logger.debug('[' + controller + '] ' + (collection.manifest ? collection.manifest.id + ' ' : '') + 'controller processing...');
				parseAlloyComponent(controller, collection.dir, collection.manifest, true);
				tracker[fp] = true;
			}
		});
	});
	logger.debug('');
//	BENCHMARK('process all controllers');

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
	logger.info("Compiling alloy to " + appJS.yellow);
//	BENCHMARK('generate app.js');

	// optimize code
	optimizeCompiledCode(alloyConfig, paths);
//	BENCHMARK('optimize runtime code')

	// trigger our custom compiler makefile
	if (compilerMakeFile.isActive) {
		compilerMakeFile.trigger("post:compile",_.clone(compileConfig));
	}
//	BENCHMARK('post:compile');
//
//	BENCHMARK('TOTAL', true);
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
			modelVariable: CONST.BIND_MODEL_VAR,
			preCode: '',
			postCode: '',
			WPATH: !manifest ? '' : _.template(fs.readFileSync(path.join(alloyRoot,'template','wpath.js'),'utf8'),{WIDGETID:manifest.id})
		},
		widgetDir = dirname ? path.join(CONST.DIR.COMPONENT,dirname) : CONST.DIR.COMPONENT,
		state = { parent: {} },
		files = {};

	// reset the bindings map
	CU.bindingsMap = {};
	CU.destroyCode = '';
	CU.postCode = '';

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

		if (theme && !manifest) {
			var themeStylesDir = path.join(compileConfig.dir.themes,theme,'styles');
			var theStyle = dirname ? path.join(dirname,viewName+'.tss') : viewName+'.tss';
			var themeStylesFile = path.join(themeStylesDir,theStyle);
			var psThemeStylesFile = path.join(themeStylesDir,buildPlatform,theStyle);	

			if (path.existsSync(psThemeStylesFile)) {
				logger.debug('  theme:      "' + path.join(theme.toUpperCase(),buildPlatform,theStyle) + '"');
				_.extend(state.styles, CU.loadAndSortStyle(psThemeStylesFile,manifest));
			} else if (path.existsSync(themeStylesFile)) {
				logger.debug('  theme:      "' + path.join(theme.toUpperCase(),theStyle) + '"');
				_.extend(state.styles, CU.loadAndSortStyle(themeStylesFile,manifest));
			}
		}

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
				'Ti.UI.TabGroup',
			].concat(CONST.MODEL_ELEMENTS);
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
						'Valid elements: [' + valid.join(',') + ']'
					]);
				}
			});
		}

		// process any model/collection nodes
		_.each(rootChildren, function(node, i) {
			var fullname = CU.getNodeFullname(node);
			var isModelElement = _.contains(CONST.MODEL_ELEMENTS,fullname);

			if (isModelElement) {
				var vCode = CU.generateNode(node, state, undefined, false, true);
				template.viewCode += vCode.content;
				template.preCode += vCode.pre;

				// remove the model/collection nodes when done
				docRoot.removeChild(node);
			}
		});

		// rebuild the children list since model elements have been removed
		rootChildren = U.XML.getElementsFromNodes(docRoot.childNodes);

		// process the UI nodes
		var assignedDefaultId = false;
		_.each(rootChildren, function(node, i) {
			var defaultId = undefined;
			var fullname = CU.getNodeFullname(node);

			if (!assignedDefaultId) {
				assignedDefaultId = true;
				defaultId = viewName;
			} 
			template.viewCode += CU.generateNode(node, createNewState(state.styles), defaultId, true);
		});
	}

	// process the controller code
	if (path.existsSync(files.CONTROLLER)) {
		logger.debug('  controller: "' + path.relative(path.join(dir,CONST.DIR.CONTROLLER),files.CONTROLLER) + '"');
	}
	var cCode = CU.loadController(files.CONTROLLER);
	template.parentController = (cCode.parentControllerName != '') ? cCode.parentControllerName : "'BaseController'";
	template.controllerCode += cCode.controller;
	template.preCode += cCode.pre;

	// process the bindingsMap, if it contains any data bindings
	var bTemplate = "$.<%= id %>.<%= prop %>=_.isFunction(<%= model %>.transform)?";
	bTemplate += "<%= model %>.transform()['<%= attr %>']:<%= model %>.get('<%= attr %>');";

	// for each model variable in the bindings map... 
	_.each(CU.bindingsMap, function(mapping,modelVar) {

		// open the model binding handler
		var handlerVar = CU.generateUniqueId();
		template.viewCode += 'var ' + handlerVar + '=function() {';
		CU.destroyCode += modelVar + ".off('" + CONST.MODEL_BINDING_EVENTS + "'," + handlerVar + ");";

		// for each specific conditional within the bindings map....
		_.each(_.groupBy(mapping, function(b) { return b.condition; }), function(bindings,condition) {
			var bCode = '';

			// for each binding belonging to this model/conditional pair...
			_.each(bindings, function(binding) {
				bCode += _.template(bTemplate, {
					id: binding.id,
					prop: binding.prop,
					model: modelVar,
					attr: binding.attr
				});
			});
			
			// if this is a legit conditional, wrap the binding code in it
			if (typeof condition !== 'undefined' && condition !== 'undefined') {
				bCode = 'if(' + condition + '){' + bCode + '}';
			}
			template.viewCode += bCode;
			
		});
		template.viewCode += "};";
		template.viewCode += modelVar + ".on('" + CONST.MODEL_BINDING_EVENTS + "'," + handlerVar + ");";
	});

	// add destroy() function to view for cleaning up bindings
	template.viewCode += 'exports.destroy=function(){' + CU.destroyCode + '};';

	// add any postCode after the controller code
	template.postCode += CU.postCode;

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

function createNewState(styles) {
	return {
		parent: {},
		styles: styles
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

function loadGlobalStyles(appPath, theme) {
	var appGlobal = path.join(appPath,CONST.DIR.STYLE,CONST.GLOBAL_STYLE);
	var themeGlobal = path.join(appPath,'themes',theme,CONST.DIR.STYLE,CONST.GLOBAL_STYLE);

	compileConfig.globalStyle = {};
	if (path.existsSync(appGlobal)) {
		logger.debug('[app.tss] global style processing...');
		compileConfig.globalStyle = _.extend(compileConfig.globalStyle, CU.loadStyle(appGlobal));
	} 
	if (theme && path.existsSync(themeGlobal)) {
		logger.debug('[app.tss (theme:' + theme + ')] global style processing...');
		compileConfig.globalStyle = _.extend(compileConfig.globalStyle, CU.loadStyle(themeGlobal));
	} 	
}

function optimizeCompiledCode() {
	var mods = [
			'builtins',
			'mangle',
			'optimizer',
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
				//logger.debug('- Processing "' + mod + '" module...');
				ast = require(modLocation+mod).process(ast, compileConfig, report) || ast;
			});
			fs.writeFileSync(fullpath, CU.generateCode(ast));
		});

		// Combine lastFiles and files, so on the next iteration we can make sure that the 
		// list of files to be processed has not grown, like in the case of builtins.
		lastFiles = _.union(lastFiles, files);
	}
}

function BENCHMARK(desc, isFinished) {
	var places = Math.pow(10,5);
	desc || (desc = '<no description>');
	if (times.first === null) {
		times.first = process.hrtime();
		return;
	}

	function hrtimeInSeconds(t) {
		return t[0] + (t[1] / 1000000000);
	}

	var total = process.hrtime(times.first);
	var current = hrtimeInSeconds(total) - (times.last ? hrtimeInSeconds(times.last) : 0);
	times.last = total;
	times.msgs.push('[' + Math.round((isFinished ? hrtimeInSeconds(total) : current)*places)/places + 's] ' + desc);
	if (isFinished) { 
		logger.trace(' ');
		logger.trace('Benchmarking');
		logger.trace('------------');
		logger.trace(times.msgs); 
	}
}