var path = require('path'),
	fs = require('fs'),
	wrench = require('wrench'),
	vm = require('vm'),
	uglifyjs = require('uglify-js'),

	// alloy requires
	_ = require('../../lib/alloy/underscore'),
	logger = require('../../logger'),
	U = require('../../utils'),
	tiapp = require('../../tiapp'),
	CONST = require('../../common/constants'),
	platforms = require('../../../platforms/index'),

	// alloy compiler requires
	CU = require('./compilerUtils'),
	styler = require('./styler'),
	sourceMapper = require('./sourceMapper'),
	CompilerMakeFile = require('./CompilerMakeFile'),
	BuildLog = require('./BuildLog'),
	Orphanage = require('./Orphanage');

var alloyRoot = path.join(__dirname,'..','..'),
	viewRegex = new RegExp('\\.' + CONST.FILE_EXT.VIEW + '$'),
	controllerRegex = new RegExp('\\.' + CONST.FILE_EXT.CONTROLLER + '$'),
	modelRegex = new RegExp('\\.' + CONST.FILE_EXT.MODEL + '$'),
	compileConfig = {},
	otherPlatforms,
	buildPlatform,
	titaniumFolder,
	buildLog,
	theme,
	widgetIds = [];

var times = {
	first: null,
	last: null,
	msgs: []
};

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

	// Initialize modules used throughout the compile process
	buildLog = new BuildLog(paths.project);
	tiapp.init(path.join(paths.project, 'tiapp.xml'));

	// validate the current Titanium SDK version, exit on failure
	tiapp.validateSdkVersion();

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
	if (program.platform) {
		logger.debug('platform = ' + program.platform);
		alloyConfig.platform = program.platform;
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
	titaniumFolder = platforms[buildPlatform].titaniumFolder;
	otherPlatforms = _.without(CONST.PLATFORM_FOLDERS, titaniumFolder);

	// create compile config from paths and various alloy config files
	logger.debug('----- CONFIG.JSON -----');
	compileConfig = CU.createCompileConfig(paths.app, paths.project, alloyConfig, buildLog);
	theme = compileConfig.theme;
	buildLog.data.themeChanged = theme !== buildLog.data.theme;
	buildLog.data.theme = theme;
	logger.debug('');

	// wipe the controllers, models, and widgets
	logger.debug('----- CLEANING RESOURCES -----');
	var orphanage = new Orphanage(paths.project, buildPlatform, {
		theme: theme,
		adapters: compileConfig.adapters
	});
	orphanage.clean();
	logger.debug('');

	// process project makefiles
	compilerMakeFile = new CompilerMakeFile();
	var alloyJMK = path.resolve(path.join(paths.app, 'alloy.jmk'));
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

		compilerMakeFile.trigger('pre:load', _.clone(compileConfig));
		logger.debug('');
	}

	// create generated controllers folder in resources
	logger.debug('----- BASE RUNTIME FILES -----');
	U.installPlugin(path.join(alloyRoot,'..'), paths.project);

	// copy in all lib resources from alloy module
	updateFilesWithBuildLog(
		path.join(alloyRoot, 'lib'),
		path.join(paths.resources, titaniumFolder),
		{
			rootDir: paths.project,
			exceptions: _.map(_.difference(CONST.ADAPTERS, compileConfig.adapters), function(a) {
				return path.join('alloy', 'sync', a + '.js');
			})
		}
	);
	updateFilesWithBuildLog(
		path.join(alloyRoot, 'common'),
		path.join(paths.resources, titaniumFolder, 'alloy'),
		{ rootDir: paths.project }
	);

	// create runtime folder structure for alloy
	_.each(['COMPONENT','WIDGET','RUNTIME_STYLE'], function(type) {
		var p = path.join(paths.resources, titaniumFolder, 'alloy', CONST.DIR[type]);
		wrench.mkdirSyncRecursive(p, 0755);
	});

	// Copy in all developer assets, libs, and additional resources
	_.each(['ASSETS','LIB','VENDOR'], function(type) {
		updateFilesWithBuildLog(
			path.join(paths.app, CONST.DIR[type]),
			path.join(paths.resources, titaniumFolder),
			{
				rootDir: paths.project,
				themeChanged: buildLog.data.themeChanged,
				filter: new RegExp('^(?:' + otherPlatforms.join('|') + ')[\\/\\\\]'),
				exceptions: otherPlatforms,
				createSourceMap: (type==='ASSETS') ? false : compileConfig.sourcemap,
				compileConfig: compileConfig,
				titaniumFolder: titaniumFolder
			}
		);
	});

	// copy in test specs if not in production
	if (alloyConfig.deploytype !== 'production') {
		updateFilesWithBuildLog(
			path.join(paths.app,'specs'),
			path.join(paths.resources, titaniumFolder, 'specs'),
			{ rootDir: paths.project }
		);
	}

	// check theme for assets
	if (theme) {
		var themeAssetsPath = path.join(paths.app,'themes',theme,'assets');

		if (path.existsSync(themeAssetsPath)) {
			updateFilesWithBuildLog(
				themeAssetsPath,
				path.join(paths.resources, titaniumFolder),
				{
					rootDir: paths.project,
					themeChanged: true,
					filter: new RegExp('^(?:' + otherPlatforms.join('|') + ')[\\/\\\\]'),
					exceptions: otherPlatforms,
					titaniumFolder: titaniumFolder
				}
			);
		}
	}
	logger.debug('');

	// trigger our custom compiler makefile
	if (compilerMakeFile.isActive) {
		compilerMakeFile.trigger('pre:compile', _.clone(compileConfig));
	}

	// [ALOY-858] Prepping folders for merging
	_.each(['i18n', 'platform'], function(folder){
		var dirPath = path.join(paths.project, folder);
		var buildDir = path.join(paths.project, 'build', folder);
		if (path.existsSync(dirPath)) {
			if(path.existsSync(buildDir)) {
				wrench.rmdirSyncRecursive(buildDir);
			}
			wrench.mkdirSyncRecursive(buildDir, 0755);
			updateFilesWithBuildLog(
				dirPath,
				buildDir
			);
		}
	});

	logger.info('----- MVC GENERATION -----');

	// create the global style, if it exists
	styler.setPlatform(buildPlatform);
	styler.loadGlobalStyles(paths.app, theme ? {theme:theme} : {});

	// Create collection of all widget and app paths
	var widgetDirs = U.getWidgetDirectories(paths.app);
	var viewCollection = widgetDirs;
	viewCollection.push({ dir: path.join(paths.project,CONST.ALLOY_DIR) });

	// Process all models
	var models = processModels(viewCollection);

	// Create a regex for determining which platform-specific
	// folders should be used in the compile process
	var filteredPlatforms = _.reject(CONST.PLATFORM_FOLDERS_ALLOY, function(p) {
		return p === buildPlatform;
	});
	filteredPlatforms = _.map(filteredPlatforms, function(p) { return p + '[\\\\\\/]'; });
	var filterRegex = new RegExp('^(?:(?!' + filteredPlatforms.join('|') + '))');

  // don't process XML/controller files inside .svn folders (ALOY-839)
  var excludeRegex = new RegExp('(?:^|[\\/\\\\])(?:' + CONST.EXCLUDED_FILES.join('|') + ')(?:$|[\\/\\\\])');

	// Process all views/controllers and generate their runtime
	// commonjs modules and source maps.
	var tracker = {};
	_.each(viewCollection, function(collection) {
		// generate runtime controllers from views
		var theViewDir = path.join(collection.dir,CONST.DIR.VIEW);
		if (fs.existsSync(theViewDir)) {
			_.each(wrench.readdirSyncRecursive(theViewDir), function(view) {
				if (viewRegex.test(view) && filterRegex.test(view) && !excludeRegex.test(view)) {
					// make sure this controller is only generated once
					var theFile = view.substring(0, view.lastIndexOf('.'));
					var theKey = theFile.replace(new RegExp('^' + buildPlatform + '[\\/\\\\]'), '');
					var fp = path.join(collection.dir, theKey);
					if (tracker[fp]) { return; }

					// generate runtime controller
					logger.info('[' + view + '] ' + (collection.manifest ? collection.manifest.id +
						' ' : '') + 'view processing...');
					parseAlloyComponent(view, collection.dir, collection.manifest);
					tracker[fp] = true;
				}
			});
		}

		// generate runtime controllers from any controller code that has no
		// corresponding view markup
		var theControllerDir = path.join(collection.dir,CONST.DIR.CONTROLLER);
		if (fs.existsSync(theControllerDir)) {
			_.each(wrench.readdirSyncRecursive(theControllerDir), function(controller) {
				if (controllerRegex.test(controller) && filterRegex.test(controller) && !excludeRegex.test(controller)) {
					// make sure this controller is only generated once
					var theFile = controller.substring(0,controller.lastIndexOf('.'));
					var theKey = theFile.replace(new RegExp('^' + buildPlatform + '[\\/\\\\]'), '');
					var fp = path.join(collection.dir, theKey);
					if (tracker[fp]) { return; }

					// generate runtime controller
					logger.info('[' + controller + '] ' + (collection.manifest ?
						collection.manifest.id + ' ' : '') + 'controller processing...');
					parseAlloyComponent(controller, collection.dir, collection.manifest, true);
					tracker[fp] = true;
				}
			});
		}
	});
	logger.info('');

	// [ALOY-858] merge "i18n" dir in theme folder
	if (theme) {
		var themeI18nPath = path.join(paths.app, CONST.DIR.THEME, theme, CONST.DIR.I18N),
			themePlatformPath = path.join(paths.app, CONST.DIR.THEME, theme, CONST.DIR.PLATFORM);

		if (path.existsSync(themePlatformPath)) {
			logger.info('  platform:     "' + themePlatformPath + '"');

			var appPlatformDir = path.join(paths.project, CONST.DIR.PLATFORM);
			if (!fs.existsSync(appPlatformDir)) {
				wrench.mkdirSyncRecursive(appPlatformDir, 0755);
			}
			wrench.copyDirSyncRecursive(themePlatformPath, appPlatformDir, {preserve: false});
		}

		if (path.existsSync(themeI18nPath)) {
			CU.mergeI18n(themeI18nPath, compileConfig.dir);
		}

		_.each(widgetIds, function(id){
			var themeWidgetDir = path.join(paths.app, CONST.DIR.THEME, theme, CONST.DIR.WIDGET, id, CONST.DIR.I18N);
			if (path.existsSync(themeWidgetDir)) {
				CU.mergeI18n(themeWidgetDir, compileConfig.dir);
			}
		});
	}
	logger.info('');

	generateAppJs(paths, compileConfig);

	// ALOY-905: workaround TiSDK < 3.2.0 iOS device build bug where it can't reference app.js
	// in platform-specific folders, so we just copy the platform-specific one to
	// the Resources folder.
	if (buildPlatform === 'ios' && tiapp.version.lt('3.2.0')) {
		U.copyFileSync(path.join(paths.resources, titaniumFolder, 'app.js'), path.join(paths.resources, 'app.js'));
	}

	// optimize code
	logger.info('----- OPTIMIZING -----');
	optimizeCompiledCode(alloyConfig, paths);

	// trigger our custom compiler makefile
	if (compilerMakeFile.isActive) {
		compilerMakeFile.trigger('post:compile', _.clone(compileConfig));
	}

	// write out the log for this build
	buildLog.write();

	BENCHMARK('TOTAL', true);
};


///////////////////////////////////////
////////// private functions //////////
///////////////////////////////////////
function generateAppJs(paths, compileConfig) {
	var alloyJs = path.join(paths.app, 'alloy.js'),

		// info needed to generate app.js
		target = {
			filename: 'Resources/' + titaniumFolder + '/app.js',
			filepath: path.join(paths.resources, titaniumFolder, 'app.js'),
			template: path.join(alloyRoot, 'template', 'app.js')
		},

		// additional data used for source mapping
		data = {
			'__MAPMARKER_ALLOY_JS__': {
				filename: 'app/alloy.js',
				filepath: alloyJs
			}
		},

		// hash used to determine if we need to rebuild
		hash = U.createHash(alloyJs);

	// is it already generated from a prior copile?
	buildLog.data[buildPlatform] || (buildLog.data[buildPlatform] = {});
	if (fs.existsSync(target.filepath) && buildLog.data[buildPlatform][alloyJs] === hash) {
		logger.info('[app.js] using cached app.js...');

	// if not, generate the platform-specific app.js and save its hash
	} else {
		logger.info('[app.js] Titanium entry point processing...');
		sourceMapper.generateCodeAndSourceMap({
			target: target,
			data: data,
		}, compileConfig);
		buildLog.data[buildPlatform][alloyJs] = hash;
	}

	logger.info('');
}

function parseAlloyComponent(view, dir, manifest, noView) {
	var parseType = noView ? 'controller' : 'view';

	// validate parameters
	if (!view) { U.die('Undefined ' + parseType + ' passed to parseAlloyComponent()'); }
	if (!dir) { U.die('Failed to parse ' + parseType + ' "' + view + '", no directory given'); }

	var dirRegex = new RegExp('^(?:' + CONST.PLATFORM_FOLDERS_ALLOY.join('|') + ')[\\\\\\/]*');
	var basename = path.basename(view, '.' + CONST.FILE_EXT[parseType.toUpperCase()]),
		dirname = path.dirname(view).replace(dirRegex,''),
		viewName = basename,
		template = {
			viewCode: '',
			modelVariable: CONST.BIND_MODEL_VAR,
			parentVariable: CONST.PARENT_SYMBOL_VAR,
			itemTemplateVariable: CONST.ITEM_TEMPLATE_VAR,
			controllerPath: (dirname ? path.join(dirname,viewName) : viewName).replace(/\\/g, '/'),
			preCode: '',
			postCode: '',
			Widget: !manifest ? '' : 'var ' + CONST.WIDGET_OBJECT +
				" = new (require('alloy/widget'))('" + manifest.id + "');this.__widgetId='" +
				manifest.id + "';",
			WPATH: !manifest ? '' : _.template(
				fs.readFileSync(path.join(alloyRoot,'template','wpath.js'),'utf8'),
				{ WIDGETID: manifest.id }
			),
			__MAPMARKER_CONTROLLER_CODE__: ''
		},
		widgetDir = dirname ? path.join(CONST.DIR.COMPONENT,dirname) : CONST.DIR.COMPONENT,
		widgetStyleDir = dirname ? path.join(CONST.DIR.RUNTIME_STYLE,dirname) :
			CONST.DIR.RUNTIME_STYLE,
		state = { parent: {}, styles: [] },
		files = {};

	// reset the bindings map
	styler.bindingsMap = {};
	CU.destroyCode = '';
	CU.postCode = '';
	CU[CONST.AUTOSTYLE_PROPERTY] = compileConfig[CONST.AUTOSTYLE_PROPERTY];
	CU.currentManifest = manifest;
	CU.currentDefaultId = viewName;

	// create a list of file paths
	var searchPaths = noView ? ['CONTROLLER'] : ['VIEW','STYLE','CONTROLLER'];
	_.each(searchPaths, function(fileType) {
		// get the path values for the file
		var fileTypeRoot = path.join(dir, CONST.DIR[fileType]);
		var filename = viewName + '.' + CONST.FILE_EXT[fileType];
		var filepath = dirname ? path.join(dirname, filename) : filename;

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
		files[fileType] = path.join(compileConfig.dir.resources, 'alloy', CONST.DIR[fileType]);
		if (dirname) { files[fileType] = path.join(files[fileType], dirname); }
		files[fileType] = path.join(files[fileType], viewName+'.js');
	});

	// we are processing a view, not just a controller
	if (!noView) {
		// validate view
		if (!path.existsSync(files.VIEW)) {
			logger.warn('No ' + CONST.FILE_EXT.VIEW + ' view file found for view ' + files.VIEW);
			return;
		}

		// load global style, if present
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

		if (theme) {
			// if a theme is applied, override TSS definitions with those defined in the theme
			var themeStylesDir, theStyle, themeStylesFile, psThemeStylesFile;
			if(!manifest) {
				// theming a "normal" controller
				themeStylesDir = path.join(compileConfig.dir.themes,theme,'styles');
				theStyle = dirname ? path.join(dirname,viewName+'.tss') : viewName+'.tss';
				themeStylesFile = path.join(themeStylesDir,theStyle);
				psThemeStylesFile = path.join(themeStylesDir,buildPlatform,theStyle);
			} else {
				// theming a widget
				themeStylesDir = path.join(compileConfig.dir.themes,theme,'widgets',manifest.id,'styles');
				theStyle = dirname ? path.join(dirname,viewName+'.tss') : viewName+'.tss';
				themeStylesFile = path.join(themeStylesDir,theStyle);
				psThemeStylesFile = path.join(themeStylesDir,buildPlatform,theStyle);
			}

			if (path.existsSync(themeStylesFile)) {
				// load theme-specific styles, overriding default definitions
				logger.info('  theme:      "' + path.join(theme.toUpperCase(),theStyle) + '"');
				state.styles = styler.loadAndSortStyle(themeStylesFile, {
					existingStyle: state.styles,
					theme: true
				});
			}
			if (path.existsSync(psThemeStylesFile)) {
				// load theme- and platform-specific styles, overriding default definitions
				logger.info('  theme:      "' +
					path.join(theme.toUpperCase(), buildPlatform, theStyle) + '"');
				state.styles = styler.loadAndSortStyle(psThemeStylesFile, {
					existingStyle: state.styles,
					platform: true,
					theme: true
				});
			}
		}

		// Load view from file into an XML document root node
		var docRoot;
		try {
			logger.info('  view:       "' +
				path.relative(path.join(dir, CONST.DIR.VIEW), files.VIEW) + '"');
			docRoot = U.XML.getAlloyFromFile(files.VIEW);
		} catch (e) {
			U.die([
				e.stack,
				'Error parsing XML for view "' + view + '"'
			]);
		}

		// see if autoStyle is enabled for the view
		if (docRoot.hasAttribute(CONST.AUTOSTYLE_PROPERTY)) {
			CU[CONST.AUTOSTYLE_PROPERTY] =
				docRoot.getAttribute(CONST.AUTOSTYLE_PROPERTY) === 'true';
		}

		// make sure we have a Window, TabGroup, or SplitWindow
		var rootChildren = U.XML.getElementsFromNodes(docRoot.childNodes);
		if (viewName === 'index' && !dirname) {
			var valid = [
				'Ti.UI.Window',
				'Ti.UI.iPad.SplitWindow',
				'Ti.UI.TabGroup',
				'Ti.UI.iOS.NavigationWindow'
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
		var hasUsedDefaultId = false;
		_.each(rootChildren, function(node, i) {

			// should we use the default id?
			var defaultId;
			if (!hasUsedDefaultId && CU.isNodeForCurrentPlatform(node)) {
				hasUsedDefaultId = true;
				defaultId = viewName;
			}

			// generate the code for this node
			var fullname = CU.getNodeFullname(node);
			template.viewCode += CU.generateNode(node, {
				parent:{},
				styles:state.styles
			}, defaultId, true);
		});
	}

	// process the controller code
	if (path.existsSync(files.CONTROLLER)) {
		logger.info('  controller: "' +
			path.relative(path.join(dir, CONST.DIR.CONTROLLER), files.CONTROLLER) + '"');
	}
	var cCode = CU.loadController(files.CONTROLLER);
	template.parentController = (cCode.parentControllerName !== '') ?
		cCode.parentControllerName : "'BaseController'";
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
		CU.destroyCode += modelVar + ".off('" + CONST.MODEL_BINDING_EVENTS + "'," +
			handlerVar + ");";

		// for each specific conditional within the bindings map....
		_.each(_.groupBy(mapping, function(b){return b.condition;}), function(bindings,condition) {
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
		template.viewCode += modelVar + ".on('" + CONST.MODEL_BINDING_EVENTS + "'," +
			handlerVar + ");";
	});

	// add destroy() function to view for cleaning up bindings
	template.viewCode += 'exports.destroy=function(){' + CU.destroyCode + '};';

	// add any postCode after the controller code
	template.postCode += CU.postCode;

	// create generated controller module code for this view/controller or widget
	var controllerCode = template.__MAPMARKER_CONTROLLER_CODE__;
	delete template.__MAPMARKER_CONTROLLER_CODE__;
	var code = _.template(fs.readFileSync(
		path.join(compileConfig.dir.template, 'component.js'), 'utf8'), template);

	// prep the controller paths based on whether it's an app
	// controller or widget controller
	var targetFilepath = path.join(compileConfig.dir.resources, titaniumFolder,
		path.relative(compileConfig.dir.resources, files.COMPONENT));
	var runtimeStylePath = path.join(compileConfig.dir.resources, titaniumFolder,
		path.relative(compileConfig.dir.resources, files.RUNTIME_STYLE));
	if (manifest) {
		wrench.mkdirSyncRecursive(
			path.join(compileConfig.dir.resources, titaniumFolder, 'alloy', CONST.DIR.WIDGET,
				manifest.id, widgetDir),
			0755
		);
		wrench.mkdirSyncRecursive(
			path.join(compileConfig.dir.resources, titaniumFolder, 'alloy', CONST.DIR.WIDGET,
				manifest.id, widgetStyleDir),
			0755
		);

		// [ALOY-967] merge "i18n" dir in widget folder
		if (fs.existsSync(path.join(dir,CONST.DIR.I18N))) {
			CU.mergeI18n(path.join(dir,CONST.DIR.I18N), compileConfig.dir);
		}
		widgetIds.push(manifest.id);

		CU.copyWidgetResources(
			[path.join(dir,CONST.DIR.ASSETS), path.join(dir,CONST.DIR.LIB)],
			path.join(compileConfig.dir.resources, titaniumFolder),
			manifest.id,
			{
				filter: new RegExp('^(?:' + otherPlatforms.join('|') + ')[\\/\\\\]'),
				exceptions: otherPlatforms,
				titaniumFolder: titaniumFolder,
				theme: theme
			}
		);
		targetFilepath = path.join(
			compileConfig.dir.resources, titaniumFolder, 'alloy', CONST.DIR.WIDGET, manifest.id,
			widgetDir, viewName + '.js'
		);
		runtimeStylePath = path.join(
			compileConfig.dir.resources, titaniumFolder, 'alloy', CONST.DIR.WIDGET, manifest.id,
			widgetStyleDir, viewName + '.js'
		);
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
	var relativeStylePath = path.relative(compileConfig.dir.project, runtimeStylePath);
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
					} else if (queryKey === 'if') {
						queriesObj[queryKey] =  query;
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
	});

	// write out the pre-processed styles to runtime module files
	var styleCode = 'module.exports = [' + processedStyles.join(',') + '];';
	if (manifest) {
		styleCode += _.template(
			fs.readFileSync(path.join(alloyRoot,'template','wpath.js'), 'utf8'),
			{ WIDGETID: manifest.id }
		);
	}
	wrench.mkdirSyncRecursive(path.dirname(runtimeStylePath), 0755);
	fs.writeFileSync(runtimeStylePath, styleCode);
}

function findModelMigrations(name, inDir) {
	try {
		var migrationsDir = inDir || compileConfig.dir.migrations;
		var files = fs.readdirSync(migrationsDir);
		var part = '_'+name+'.'+CONST.FILE_EXT.MIGRATION;

		// look for our model
		files = _.reject(files, function(f) { return f.indexOf(part) === -1; });

		// sort them in the oldest order first
		files = files.sort(function(a,b){
			var x = a.substring(0,a.length - part.length -1);
			var y = b.substring(0,b.length - part.length -1);
			if (x<y) { return -1; }
			if (x>y) { return 1; }
			return 0;
		});

		var codes = [];
		_.each(files,function(f) {
			var mf = path.join(migrationsDir,f);
			var m = fs.readFileSync(mf,'utf8');
			var code = "(function(migration){\n " +
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
			var modelRuntimeDir = path.join(compileConfig.dir.resources,
				titaniumFolder, 'alloy', 'models');
			if (isWidget) {
				modelRuntimeDir = path.join(compileConfig.dir.resources,
					titaniumFolder, 'alloy', 'widgets', manifest.id, 'models');
			}
			wrench.mkdirSyncRecursive(modelRuntimeDir, 0755);
			fs.writeFileSync(path.join(modelRuntimeDir,casedBasename+'.js'), code);
			models.push(casedBasename);
		});
	});

	return models;
}

function updateFilesWithBuildLog(src, dst, opts) {
	U.updateFiles(src, dst, _.extend({ isNew: buildLog.isNew }, opts));
}

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
			'alloy/underscore.js',
			'alloy/widget.js'
		];
		_.each(exceptions.slice(0), function(ex) {
			exceptions.push(path.join(titaniumFolder, ex));
		});

		var rx = new RegExp('^(?!' + otherPlatforms.join('|') + ').+\\.js$');
		return _.filter(wrench.readdirSyncRecursive(compileConfig.dir.resources), function(f) {
			// TODO: remove should.js check here once ALOY-921 is resolved
			//		also remove check in sourceMapper.js exports.generateSourceMap()
			return rx.test(f) && !/(?:^|[\\\/])should\.js$/.test(f) && !_.find(exceptions, function(e) {
				return f.indexOf(e) === 0;
			});
		});
	}

	while((files = _.difference(getJsFiles(),lastFiles)).length > 0) {
		_.each(files, function(file) {
			// generate AST from file
			var fullpath = path.join(compileConfig.dir.resources,file);
			var ast;
			logger.info('- ' + file);
			try {
				ast = uglifyjs.parse(fs.readFileSync(fullpath,'utf8'), {
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
	desc = desc || '<no description>';
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
