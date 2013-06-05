var path = require('path'),	
	fs = require('fs'),
	wrench = require('wrench'),
	vm = require('vm'),
	uglifyjs = require('uglify-js'),
	jsonlint = require('jsonlint'),
	sourceMapper = require('./sourceMapper'),
	styler = require('./styler'),
	_ = require("../../lib/alloy/underscore")._,
	logger = require('../../logger'),
	CompilerMakeFile = require('./CompilerMakeFile'),
	U = require('../../utils'),
	CU = require('./compilerUtils'),
	CONST = require('../../common/constants'),
	platforms = require('../../../platforms/index');

var alloyRoot = path.join(__dirname,'..','..'),
	viewRegex = new RegExp('\\.' + CONST.FILE_EXT.VIEW + '$'),
	controllerRegex = new RegExp('\\.' + CONST.FILE_EXT.CONTROLLER + '$'),
	modelRegex = new RegExp('\\.' + CONST.FILE_EXT.MODEL + '$'),
	compileConfig = {},
	buildPlatform,
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
	BENCHMARK();
	var alloyConfig = {},
		compilerMakeFile,
		paths = U.getAndValidateProjectPaths(
			program.outputPath || args[0] || process.cwd()
		);

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

	// construct compiler config from command line config parameters
	// and print the configuration data
	logger.debug('----- CONFIGURATION -----');
	if (program.config && _.isString(program.config)) {
		logger.debug('raw config = "' + program.config + '"');
		_.each(program.config.split(','), function(v) {
			var parts = v.split('=');
			alloyConfig[parts[0]] = parts[1];
			logger.debug(parts[0] + ' = ' + parts[1]);
		});
	}
	if (!alloyConfig.deploytype) {
		alloyConfig.deploytype = 'development';
		logger.debug('deploytype = ' + alloyConfig.deploytype);
	}
	logger.debug('project path = ' + paths.project);
	logger.debug('app path = ' + paths.app);
	logger.debug('');

	// make sure a platform was specified
	buildPlatform = alloyConfig.platform;
	if (!buildPlatform) {
		U.die([
			'You must define a target platform for the alloy compile command',
			'  Ex. "alloy compile --config platform=ios"'  
		]);
	}

	// Cleanup?
	if (alloyConfig.cleanup !== 'false') {

		// wipe the controllers, models, and widgets
		logger.debug('----- CLEANING RESOURCES -----');
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
				path.join(alloyRoot,'common'),
				path.join(paths.app,CONST.DIR.ASSETS),
				path.join(paths.app,CONST.DIR.LIB),
				path.join(paths.app,'vendor'),
			],
			{
				exceptions: [
					// still need to check for builtins
					path.join('alloy'),
					path.join('alloy','CFG.js'),
					path.join('alloy','constants.js'),
					path.join('alloy','controllers'),
					path.join('alloy','widgets'),
					path.join('alloy','models')
				],
				platform: platforms[buildPlatform].titaniumFolder
			}
		);
	}

	// create compile config from paths and various alloy config files
	logger.debug('----- CONFIG.JSON -----');
	compileConfig = CU.createCompileConfig(paths.app, paths.project, alloyConfig);
	
	// identify current theme, if any
	(theme = compileConfig.theme) && logger.debug('theme = ' + theme);
	logger.debug('');
	
	// Cleaned up?
	if (alloyConfig.cleanup !== 'false' || path.existsSync(path.join(paths.resources,'alloy')) === false) {

		// create generated controllers folder in resources 
		logger.debug('----- BASE RUNTIME FILES -----');
		U.installPlugin(path.join(alloyRoot,'..'), paths.project);

		// copy in all lib resources from alloy module
		U.updateFiles(path.join(alloyRoot, 'lib'), paths.resources);
		U.updateFiles(path.join(alloyRoot, 'common'), path.join(paths.resources,'alloy'));

		// create runtime folder structure for alloy
		_.each(['COMPONENT','WIDGET','RUNTIME_STYLE'], function(type) {
			var p = path.join(paths.resourcesAlloy, CONST.DIR[type]);
			wrench.mkdirSyncRecursive(p, 0777);
		});

		// Copy in all developer assets, libs, and additional resources
		_.each(['ASSETS','LIB','VENDOR'], function(type) {
			U.updateFiles(path.join(paths.app,CONST.DIR[type]), paths.resources);
		});

		// copy in test specs if not in production
		if (alloyConfig.deploytype !== 'production') {
			U.updateFiles(path.join(paths.app,'specs'), path.join(paths.resources,'specs'));
		}

		logger.debug('');

		// check theme for assets
		if (theme) {
			var themeAssetsPath = path.join(paths.app,'themes',theme,'assets');
			if (path.existsSync(themeAssetsPath)) {
				wrench.copyDirSyncRecursive(themeAssetsPath, paths.resources, {preserve:true});
			}
		}
		logger.debug('');
	}

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
			U.die('Project build at "' + alloyJMK + '" generated an error during load.');
		}

		compilerMakeFile.trigger("pre:compile",_.clone(compileConfig));
		logger.debug('');
	}

	// TODO: https://jira.appcelerator.org/browse/ALOY-477
	if (buildPlatform === 'android') {
		U.tiapp.upStackSizeForRhino(paths.project);
	}

	logger.info('----- MVC GENERATION -----');

	// create the global style, if it exists
	styler.setPlatform(buildPlatform);
	styler.loadGlobalStyles(paths.app, theme ? {theme:theme} : {});
	
	// Create collection of all widget and app paths 
	var widgetDirs = U.getWidgetDirectories(paths.project, paths.app);
	var viewCollection = widgetDirs;
	viewCollection.push({ dir: path.join(paths.project,CONST.ALLOY_DIR) });

	// Process all models
	var models = processModels(viewCollection);

	// Create a regex for determining which platform-specific
	// folders should be used in the compile process
	var filteredPlatforms = _.reject(CONST.PLATFORM_FOLDERS_ALLOY, function(p) { return p === buildPlatform; });
	filteredPlatforms = _.map(filteredPlatforms, function(p) { return p + '[\\\\\\/]'; });
	var filterRegex = new RegExp('^(?:(?!' + filteredPlatforms.join('|') + '))');
	
	// Process all views/controllers and generate their runtime 
	// commonjs modules and source maps.
	var tracker = {};
	_.each(viewCollection, function(collection) {
		// generate runtime controllers from views
		_.each(wrench.readdirSyncRecursive(path.join(collection.dir,CONST.DIR.VIEW)), function(view) {
			if (viewRegex.test(view) && filterRegex.test(view)) {
				// make sure this controller is only generated once
				var fp = path.join(collection.dir,view.substring(0,view.lastIndexOf('.')));
				if (tracker[fp]) { return; }

				// generate runtime controller
				logger.info('[' + view + '] ' + (collection.manifest ? collection.manifest.id + ' ' : '') + 'view processing...');
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
				logger.info('[' + controller + '] ' + (collection.manifest ? collection.manifest.id + ' ' : '') + 'controller processing...');
				parseAlloyComponent(controller, collection.dir, collection.manifest, true);
				tracker[fp] = true;
			}
		});
	});
	logger.info('');

	// generate app.js
	logger.info('[app.js] Titanium entry point processing...');
	var appJS = path.join(compileConfig.dir.resources,"app.js");
	sourceMapper.generateCodeAndSourceMap({
		target: {
			filename: 'Resources/app.js',
			filepath: appJS,
			template: path.join(alloyRoot,'template','app.js')
		},
		data: {
			'__MAPMARKER_ALLOY_JS__': {
				filename: 'app/alloy.js',
				filepath: path.join(paths.app,'alloy.js')
			}
		}
	}, compileConfig);
	logger.info('');
	
	// optimize code
	logger.info('----- OPTIMIZING -----');
	optimizeCompiledCode(alloyConfig, paths);

	// trigger our custom compiler makefile
	if (compilerMakeFile.isActive) {
		compilerMakeFile.trigger("post:compile",_.clone(compileConfig));
	}

	BENCHMARK('TOTAL', true);
};


///////////////////////////////////////
////////// private functions //////////
///////////////////////////////////////
function parseAlloyComponent(view,dir,manifest,noView) {
	var parseType = noView ? 'controller' : 'view';

	// validate parameters
	if (!view) { U.die('Undefined ' + parseType + ' passed to parseAlloyComponent()'); }
	if (!dir) { U.die('Failed to parse ' + parseType + ' "' + view + '", no directory given'); }

	var dirRegex = new RegExp('^(?:' + CONST.PLATFORM_FOLDERS_ALLOY.join('|') + ')[\\\\\\/]*');
	var basename = path.basename(view, '.' + CONST.FILE_EXT[parseType.toUpperCase()]);
		dirname = path.dirname(view).replace(dirRegex,''), // /^(?:android|ios|mobileweb)[\\\/]*/,''),
		viewName = basename,
		template = {
			viewCode: '',
			modelVariable: CONST.BIND_MODEL_VAR,
			parentVariable: CONST.PARENT_SYMBOL_VAR,
			itemTemplateVariable: CONST.ITEM_TEMPLATE_VAR,
			preCode: '',
			postCode: '',
			Widget: !manifest ? '' : "var " + CONST.WIDGET_OBJECT + " = new (require('alloy/widget'))('" + manifest.id + "');",
			WPATH: !manifest ? '' : _.template(fs.readFileSync(path.join(alloyRoot,'template','wpath.js'),'utf8'),{WIDGETID:manifest.id}),
			__MAPMARKER_CONTROLLER_CODE__: '',
		},
		widgetDir = dirname ? path.join(CONST.DIR.COMPONENT,dirname) : CONST.DIR.COMPONENT,
		widgetStyleDir = dirname ? path.join(CONST.DIR.RUNTIME_STYLE,dirname) : CONST.DIR.RUNTIME_STYLE,
		state = { parent: {}, styles: [] },
		files = {};

	// reset the bindings map
	styler.bindingsMap = {};
	CU.destroyCode = '';
	CU.postCode = '';
	CU.currentManifest = manifest;

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
				if (fileType === 'STYLE') {
					files[fileType] = [
						{ file:baseFile },
						{ file:platformSpecificFile, platform:true }
					];
				} else {
					files[fileType] = platformSpecificFile;
				}
				return;
			}
		}
		files[fileType] = baseFile;
	});

	_.each(['COMPONENT','RUNTIME_STYLE'], function(fileType) {
		files[fileType] = path.join(compileConfig.dir.resourcesAlloy,CONST.DIR[fileType]);
		if (dirname) { files[fileType] = path.join(files[fileType],dirname); }
		files[fileType] = path.join(files[fileType],viewName+'.js');
	});

	// we are processing a view, not just a controller
	if (!noView) {
		// validate view
		if (!path.existsSync(files.VIEW)) {
			logger.warn('No ' + CONST.FILE_EXT.VIEW + ' view file found for view ' + files.VIEW);
			return;
		}

		// load global style, if present
		//state.styles = compileConfig && compileConfig.globalStyle ? compileConfig.globalStyle : [];
		state.styles = styler.globalStyle || [];

		// Load the style and update the state
		if (files.STYLE) {
			var theStyles = _.isArray(files.STYLE) ? files.STYLE : [{file:files.STYLE}];
			_.each(theStyles, function(style) {
				if (fs.existsSync(style.file)) {
					logger.info('  style:      "' + 
						path.relative(path.join(dir,CONST.DIR.STYLE),style.file) + '"');
					state.styles = styler.loadAndSortStyle(style.file, {
						existingStyle: state.styles,
						platform: style.platform
					});
				}
			});
		} 

		if (theme && !manifest) {
			var themeStylesDir = path.join(compileConfig.dir.themes,theme,'styles');
			var theStyle = dirname ? path.join(dirname,viewName+'.tss') : viewName+'.tss';
			var themeStylesFile = path.join(themeStylesDir,theStyle);
			var psThemeStylesFile = path.join(themeStylesDir,buildPlatform,theStyle);	

			if (path.existsSync(themeStylesFile)) {
				logger.info('  theme:      "' + path.join(theme.toUpperCase(),theStyle) + '"');
				state.styles = styler.loadAndSortStyle(themeStylesFile, {
					existingStyle: state.styles,
					theme: true
				});
			}
			if (path.existsSync(psThemeStylesFile)) {
				logger.info('  theme:      "' + path.join(theme.toUpperCase(),buildPlatform,theStyle) + '"');
				state.styles = styler.loadAndSortStyle(psThemeStylesFile, {
					existingStyle: state.styles,
					platform: true,
					theme: true
				});
			}
		}

		// Load view from file into an XML document root node
		try {
			logger.info('  view:       "' + path.relative(path.join(dir,CONST.DIR.VIEW),files.VIEW)+ '"');
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
			template.viewCode += CU.generateNode(node, {parent:{},styles:state.styles}, defaultId, true);
		});
	}

	// process the controller code
	if (path.existsSync(files.CONTROLLER)) {
		logger.info('  controller: "' + path.relative(path.join(dir,CONST.DIR.CONTROLLER),files.CONTROLLER) + '"');
	}
	var cCode = CU.loadController(files.CONTROLLER);
	template.parentController = (cCode.parentControllerName != '') ? cCode.parentControllerName : "'BaseController'";
	template.__MAPMARKER_CONTROLLER_CODE__ += cCode.controller;
	template.preCode += cCode.pre;

	// process the bindingsMap, if it contains any data bindings
	var bTemplate = "$.<%= id %>.<%= prop %>=_.isFunction(<%= model %>.transform)?";
	bTemplate += "<%= model %>.transform()['<%= attr %>']:<%= model %>.get('<%= attr %>');";

	// for each model variable in the bindings map... 
	_.each(styler.bindingsMap, function(mapping,modelVar) {

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
	var controllerCode = template.__MAPMARKER_CONTROLLER_CODE__;
	delete template.__MAPMARKER_CONTROLLER_CODE__;
	var code = _.template(fs.readFileSync(path.join(compileConfig.dir.template, 'component.js'), 'utf8'), template);

	// prep the controller paths based on whether it's an app
	// controller or widget controller
	var targetFilepath = files.COMPONENT;
	var runtimeStylePath = files.RUNTIME_STYLE;
	if (manifest) {
		wrench.mkdirSyncRecursive(path.join(compileConfig.dir.resourcesAlloy, CONST.DIR.WIDGET, manifest.id, widgetDir), 0777);
		wrench.mkdirSyncRecursive(path.join(compileConfig.dir.resourcesAlloy, CONST.DIR.WIDGET, manifest.id, widgetStyleDir), 0777);
		CU.copyWidgetResources(
			[path.join(dir,CONST.DIR.ASSETS), path.join(dir,CONST.DIR.LIB)], 
			compileConfig.dir.resources, 
			manifest.id
		);
		targetFilepath = path.join(compileConfig.dir.resourcesAlloy, CONST.DIR.WIDGET, manifest.id, widgetDir, viewName + '.js');
		runtimeStylePath = path.join(compileConfig.dir.resourcesAlloy, CONST.DIR.WIDGET, manifest.id, widgetStyleDir, viewName + '.js');
	}

	// generate the code and source map for the current controller
	sourceMapper.generateCodeAndSourceMap({
		target: {
			filename: path.relative(compileConfig.dir.project,files.COMPONENT),
			filepath: targetFilepath,
			templateContent: code
		},
		data: {
			__MAPMARKER_CONTROLLER_CODE__: {
				filename: path.relative(compileConfig.dir.project,files.CONTROLLER),
				fileContent: controllerCode
			}
		}
	}, compileConfig);

	// initiate runtime style module creation
	var relativeStylePath = path.relative(compileConfig.dir.project,runtimeStylePath);
	logger.info('  created:     "' + relativeStylePath + '"');

	// pre-process runtime controllers to save runtime performance
	var STYLE_PLACEHOLDER = '__STYLE_PLACEHOLDER__';
	var STYLE_REGEX = new RegExp('[\'"]' + STYLE_PLACEHOLDER + '[\'"]');
	var processedStyles = [];
	_.each(state.styles, function(s) {
		var o = {};

		// make sure this style entry applies to the current platform
		if (s && s.queries && s.queries.platform && 
			!_.contains(s.queries.platform, buildPlatform)) {
			return;
		}

		// get the runtime processed version of the JSON-safe style
		var processed = '{' + styler.processStyle(s.style, state) + '}';
		
		// create a temporary style object, sans style key
		_.each(s, function(v,k) {
			if (k === 'queries') {
				var queriesObj = {};

				// optimize style conditionals for runtime
				_.each(s[k], function(query, queryKey) {
					if (queryKey === 'platform') {
						// do nothing, we don't need the platform key anymore
					} else if (queryKey === 'formFactor') {
						queriesObj[queryKey] = 'is' + U.ucfirst(query);
					} else {
						logger.warn('Unknown device query "' + queryKey + '"');
					}
				});

				// add the queries object, if not empty
				if (!_.isEmpty(queriesObj)) {
					o[k] = queriesObj;
				}
			} else if (k !== 'style') { 
				o[k] = v; 
			}
		});

		// Create a full processed style string by inserting the processed style
		// into the JSON stringifed temporary style object
		o.style = STYLE_PLACEHOLDER;
		processedStyles.push(JSON.stringify(o).replace(STYLE_REGEX, processed));
	})

	// write out the pre-processed styles to runtime module files
	wrench.mkdirSyncRecursive(path.dirname(runtimeStylePath), 0777);
	fs.writeFileSync(
		runtimeStylePath, 
		'module.exports = [' + processedStyles.join(',') + '];'
	);
}

function findModelMigrations(name, inDir) {
	try {
		var migrationsDir = inDir || compileConfig.dir.migrations;
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
		logger.info("Found " + codes.length + " migrations for model: " + name);
		return codes;
	} catch(E) {
		return [];
	}
}

function processModels(dirs) {
	var models = [];
	var modelTemplateFile = path.join(alloyRoot,'template','model.js');

	_.each(dirs, function(dirObj) {
		var modelDir = path.join(dirObj.dir,CONST.DIR.MODEL);
		if (!fs.existsSync(modelDir)) {
			return;
		}

		var migrationDir = path.join(dirObj.dir,CONST.DIR.MIGRATION);
		var manifest = dirObj.manifest;
		var isWidget = typeof manifest !== 'undefined' && manifest !== null;
		var pathPrefix = isWidget ? 'widgets/' + manifest.id + '/': '';
		_.each(fs.readdirSync(modelDir), function(file) {
			if (!modelRegex.test(file)) {
				logger.warn('Non-model file "' + file + '" in ' + pathPrefix + 'models directory');
				return;
			}
			logger.info('[' + pathPrefix + 'models/' + file + '] model processing...');

			var fullpath = path.join(modelDir,file);
			var basename = path.basename(fullpath, '.'+CONST.FILE_EXT.MODEL);

			// generate model code based on model.js template and migrations
			var code = _.template(fs.readFileSync(modelTemplateFile,'utf8'), {
				basename: basename,
				modelJs: fs.readFileSync(fullpath,'utf8'),
				migrations: findModelMigrations(basename, migrationDir)
			});	

			// write the model to the runtime file
			var casedBasename = U.properCase(basename);
			var modelRuntimeDir = path.join(compileConfig.dir.resourcesAlloy,'models');
			if (isWidget) {
				modelRuntimeDir = path.join(compileConfig.dir.resourcesAlloy,'widgets',manifest.id,'models');
			}
			wrench.mkdirSyncRecursive(modelRuntimeDir, 0777);
			fs.writeFileSync(path.join(modelRuntimeDir,casedBasename+'.js'), code);
			models.push(casedBasename);
		});
	});

	return models;
};

function optimizeCompiledCode() {
	var mods = [
			'builtins',
			'optimizer',
			'compress'			
		],
		modLocation = './ast/',
		lastFiles = [],
		files;
		
	// Get the list of JS files from the Resources directory
	// and exclude files that don't need to be optimized, or
	// have already been optimized.
	function getJsFiles() {
		var exceptions = [
			'app.js',
			'alloy/CFG.js',
			'alloy/controllers/',
			'alloy/styles/',
			'alloy/backbone.js',
			'alloy/constants.js',
			'alloy/underscore.js'
		];
		return _.filter(wrench.readdirSyncRecursive(compileConfig.dir.resources), function(f) {
			return /\.js\s*$/.test(f) && !_.find(exceptions, function(e) { 
				return f.indexOf(e) === 0; 
			});
		});
	}

	while((files = _.difference(getJsFiles(),lastFiles)).length > 0) {
		_.each(files, function(file) {
			// generate AST from file
			var fullpath = path.join(compileConfig.dir.resources,file);
			logger.info('- ' + file);
			try {
				var ast = uglifyjs.parse(fs.readFileSync(fullpath,'utf8'), {
					filename: file
				});
			} catch (e) {
				U.die('Error generating AST for "' + fullpath + '"', e);
			}

			// process all AST operations
			_.each(mods, function(mod) {
				logger.trace('  processing "' + mod + '" module...');
				ast.figure_out_scope();
				ast = require(modLocation+mod).process(ast, compileConfig) || ast;
			});

			// Write out the optimized file
			var stream = uglifyjs.OutputStream(sourceMapper.OPTIONS_OUTPUT);
			ast.print(stream);
			fs.writeFileSync(fullpath, stream.toString());
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
	var thisTime = Math.round((isFinished ? hrtimeInSeconds(total) : current)*places)/places;
	times.msgs.push('[' + thisTime + 's] ' + desc);
	if (isFinished) { 
		logger.trace(' ');
		logger.trace('Benchmarking');
		logger.trace('------------');
		logger.trace(times.msgs); 
		logger.info('');
		logger.info('Alloy compiled in ' + thisTime + 's');
	}
}