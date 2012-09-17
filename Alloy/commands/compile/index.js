var path = require('path'),	
	colors = require('colors'),
	fs = require('fs'),
	wrench = require('wrench'),
	DOMParser = require("xmldom").DOMParser,
	XMLSerializer = require('xmldom').XMLSerializer,
	U = require('../../utils'),
	_ = require("../../lib/alloy/underscore")._,
	logger = require('../../common/logger'),
	requires = require('./requires'),
	CompilerMakeFile = require('./CompilerMakeFile'),
	CU = require('./compilerUtils'),
	CONST = require('../../common/constants'),
	optimizer = require('./optimizer');

var alloyRoot = path.join(__dirname,'..','..'),
	viewRegex = new RegExp('\\.' + CONST.FILE_EXT.VIEW + '$'),
	controllerRegex = new RegExp('\\.' + CONST.FILE_EXT.CONTROLLER + '$'),
	modelRegex = new RegExp('\\.' + CONST.FILE_EXT.MODEL + '$'),
	compileConfig = {};

//////////////////////////////////////
////////// command function //////////
//////////////////////////////////////
module.exports = function(args, program) {
	var inputPath = args.length > 0 ? args[0] : U.resolveAppHome(),
		alloyConfig = {},
		outputPath, tmpPath, compilerMakeFile;

	// validate input and output paths
	if (!path.existsSync(inputPath)) {
		U.die('inputPath "' + inputPath + '" does not exist');
	} else if (!path.existsSync(path.join(inputPath,'views','index.' + CONST.FILE_EXT.VIEW))) {
		U.die('inputPath has no views/index.' + CONST.FILE_EXT.VIEW + ' file.');
	}	

	if (!program.outputPath) {
		tmpPath = path.join(inputPath,'views','index.'+CONST.FILE_EXT.VIEW);
		if (path.existsSync(tmpPath)) {
			outputPath = path.join(inputPath,'..');
		}
	}
	outputPath = outputPath ? outputPath : (program.outputPath || path.join(U.resolveAppHome(),".."));
	U.ensureDir(outputPath);

	// make sure the output path is actually a ti project
	if (!path.existsSync(path.join(outputPath,'tiapp.xml'))) {
		U.die('Project path "' + outputPath + '" has no tiapp.xml file.');
	}

	// remove the project's Resources directory, as it will all 
	// be replaced by Alloy. Only do it if the "assets" path is 
	// properly prepared.
	var resourcesPath = path.join(outputPath,'Resources');
	var appAssetsPath = path.join(inputPath,'assets');
	var cleanResources = true;
	_.each(CONST.PLATFORM_FOLDERS, function(platform) {
		if (path.existsSync(path.join(resourcesPath,platform)) && 
			!path.existsSync(path.join(appAssetsPath,platform))) {
			logger.warn('"' + platform + '" folder found in Resources, but not app/assets. Not cleaning Resources...');
			cleanResources = false;
		}
	});
	if (cleanResources) {
		wrench.rmdirSyncRecursive(resourcesPath, true);
		wrench.mkdirSyncRecursive(resourcesPath, 0777);
	}

	// construct compiler config from command line config parameters
	if (program.config && _.isString(program.config)) {
		_.each(program.config.split(','), function(v) {
			var a = v.split('=');
			alloyConfig[a[0]]=a[1];
		});
	}
	alloyConfig.deploytype = alloyConfig.deploytype || 'development';
	alloyConfig.beautify = alloyConfig.beautify || alloyConfig.deploytype === 'development';

	// create compile config from paths and various alloy config files
	compilerMakeFile = new CompilerMakeFile();
	compileConfig = CU.createCompileConfig(inputPath, outputPath, alloyConfig);
	logger.info("Generating to " + compileConfig.dir.resources.yellow + " from ".cyan + inputPath.yellow);

	// process project makefiles
	var alloyJMK = path.resolve(path.join(inputPath,"alloy.jmk"));
	if (path.existsSync(alloyJMK)) {
		logger.info("Found project specific makefile at " + "app/alloy.jmk".yellow);
		var vm = require('vm'),
			util = require('util');
		var script = vm.createScript(fs.readFileSync(alloyJMK), 'alloy.jmk');
		
		try {
			script.runInNewContext(compilerMakeFile);
		} catch(e) {
			logger.error(e.stack);
			U.die("project build at "+alloyJMK.yellow + " generated an error during load.");
		}
	}
	
	// trigger our custom compiler makefile
	compilerMakeFile.trigger("pre:compile",_.clone(compileConfig));

	// TODO: ti.physicalSizeCategory - https://jira.appcelerator.org/browse/ALOY-209
	if (!path.existsSync(path.join(outputPath,'ti.physicalSizeCategory-android-1.0.zip')) && 
		!path.existsSync(path.join(outputPath,'modules','android','ti.physicalsizecategory','1.0','timodule.xml'))) {
		wrench.copyDirSyncRecursive(path.join(alloyRoot,'modules'), outputPath, {preserve:true})
	}
	U.tiapp.installModule(outputPath, {
		id: 'ti.physicalSizeCategory',
		platform: 'android',
		version: '1.0'
	});

	// create generated controllers folder in resources 
	U.copyAlloyDir(alloyRoot, 'lib', compileConfig.dir.resources); 
	wrench.mkdirSyncRecursive(path.join(compileConfig.dir.resourcesAlloy, CONST.DIR.COMPONENT), 0777);
	wrench.mkdirSyncRecursive(path.join(compileConfig.dir.resourcesAlloy, 'widgets'), 0777);

	// create the global style, if it exists
	try {
		compileConfig.globalStyle = CU.loadStyle(path.join(inputPath,CONST.DIR.STYLE,CONST.GLOBAL_STYLE));
	} catch(e) {
		logger.error(e.stack);
		U.die('Error processing global style at "' + path.join(inputPath,CONST.DIR.STYLE,CONST.GLOBAL_STYLE) + '"');
	}

	// Process all models
	var models = processModels();

	// Process all views, including all those belonging to widgets
	var viewCollection = U.getWidgetDirectories(outputPath, inputPath);
	viewCollection.push({ dir: path.join(outputPath,CONST.ALLOY_DIR) });
	_.each(viewCollection, function(collection) {
		// generate runtime controllers from views
		_.each(wrench.readdirSyncRecursive(path.join(collection.dir,CONST.DIR.VIEW)), function(view) {
			if (viewRegex.test(view)) {
				parseAlloyComponent(view, collection.dir, collection.manifest);
			}
		});

		// generate runtime controllers from any controller code that has no 
		// corresponding view markup
		_.each(wrench.readdirSyncRecursive(path.join(collection.dir,CONST.DIR.CONTROLLER)), function(controller) {
			if (controllerRegex.test(controller)) {
				parseAlloyComponent(controller, collection.dir, collection.manifest,true);
			}
		});
	});

	// copy assets and libraries
	U.copyAlloyDir(inputPath, [CONST.DIR.ASSETS,CONST.DIR.LIB], compileConfig.dir.resources);

	// generate app.js
	var appJS = path.join(compileConfig.dir.resources,"app.js");
	var code = _.template(fs.readFileSync(path.join(alloyRoot,'template','app.js'),'utf8'),{models:models});
	
	try {
		code = CU.processSourceCode(code, alloyConfig, 'app.js');
	} catch(e) {
		logger.error(code);
		U.die(e.stack);
	}

	// trigger our custom compiler makefile
	var njs = compilerMakeFile.trigger("compile:app.js",_.extend(_.clone(compileConfig), {"code":code, "appJSFile" : path.resolve(appJS)}));
	if (njs) {
		code = njs;
	}
	fs.writeFileSync(appJS,code);
	logger.info("compiling alloy to " + appJS.yellow);

	// copy builtins and fix their require paths
	copyBuiltins();

	// optimize code
	optimizeCompiledCode(alloyConfig);

	// trigger our custom compiler makefile
	compilerMakeFile.trigger("post:compile",_.clone(compileConfig));
};


///////////////////////////////////////
////////// private functions //////////
///////////////////////////////////////
function parseAlloyComponent(view,dir,manifest,noView) {
	var parseType = noView ? 'controller' : 'view';
	logger.debug('Now parsing ' + (manifest ? manifest.id + ' ' : '') + parseType + ' ' + view + '...');

	var buildPlatform = compileConfig && compileConfig.alloyConfig && compileConfig.alloyConfig.platform ? compileConfig.alloyConfig.platform : null;

	// validate parameters
	if (!view) { U.die('Undefined ' + parseType + ' passed to parseAlloyComponent()'); }
	if (!dir) { U.die('Failed to parse ' + parseType + ' "' + view + '", no directory given'); }

	var basename = path.basename(view, '.' + CONST.FILE_EXT[parseType.toUpperCase()]);
		dirname = path.dirname(view),
		viewName = basename,
		template = {
			viewCode: '',
			controllerCode: '',
			exportsCode: ''
		},
		widgetDir = dirname ? path.join(CONST.DIR.COMPONENT,dirname) : CONST.DIR.COMPONENT,
		state = { parent: {} },
		files = {};

	// create a list of file paths
	_.each(['VIEW','STYLE','CONTROLLER'], function(fileType) {
		// get the path values for the file
		var fileTypeRoot = path.join(dir,CONST.DIR[fileType]);
		var filename = viewName+'.'+CONST.FILE_EXT[fileType];
		var filepath = dirname ? path.join(dirname,filename) : filename;

		// check for platform-specific versions of the file
		var baseFile = path.join(fileTypeRoot,filepath);
		var platformSpecificFile = path.join(fileTypeRoot,buildPlatform,filepath);
		files[fileType] = path.existsSync(platformSpecificFile) ? platformSpecificFile : baseFile;
	});
	files.COMPONENT = path.join(compileConfig.dir.resourcesAlloy,CONST.DIR.COMPONENT);
	if (dirname) { files.COMPONENT = path.join(files.COMPONENT,dirname); }
	files.COMPONENT = path.join(files.COMPONENT,viewName+'.js');

	// skip if we've already processed this component
	var testExistsFile = manifest ? path.join(compileConfig.dir.resourcesAlloy, CONST.DIR.WIDGET, manifest.id, widgetDir, viewName + '.js') : files.COMPONENT;
	if (path.existsSync(testExistsFile) && noView) {
		return;
	}

	// we are processing a view, not just a controller
	if (!noView) {
		// validate view
		if (!path.existsSync(files.VIEW)) {
			logger.warn('No ' + CONST.FILE_EXT.VIEW + ' view file found for view ' + files.VIEW);
			return;
		}

		// Load the style and update the state
		try {
			state.styles = CU.loadAndSortStyle(files.STYLE);
		} catch (e) {
			var errs = ['Error processing style for view "' + view + '" in "' + view + '.' + CONST.FILE_EXT.STYLE + '"'];
			if (e.message && typeof e.line !== 'undefined') {
				errs.push(e.message);
				errs.push('line ' + e.line + ', column ' + e.col + ', position ' + e.pos);
			} else {
				errs.unshift(e.stack);
			}
			U.die(errs);
		}

		// Load view from file into an XML document root node
		try {
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
	var cCode = CU.loadController(files.CONTROLLER);
	template.parentController = (cCode.parentControllerName != '') ? cCode.parentControllerName : "'BaseController'";
	template.controllerCode += cCode.controller;
	template.exportsCode += cCode.exports;

	// create generated controller module code for this view/controller or widget
	var code = _.template(fs.readFileSync(path.join(compileConfig.dir.template, 'component.js'), 'utf8'), template);
	try {
		code = CU.processSourceCode(code, compileConfig.alloyConfig, files.COMPONENT);
	} catch (e) {
		U.die([
			e.stack,
			'Error parsing view "' + view + '".'
		]);
	}

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
		var fullpath = path.join(compileConfig.dir.models,modelFile);
		var basename = path.basename(fullpath, '.'+CONST.FILE_EXT.MODEL);
		var modelJsFile = path.join(compileConfig.dir.models,basename+'.js');
		var modelConfig = fs.readFileSync(fullpath);
		var modelJs = 'function(Model){}';

		// grab any additional model code from corresponding JS file, if it exists
		if (path.existsSync(modelJsFile)) {
			modelJs = fs.readFileSync(modelJsFile,'utf8');
		}

		// generate model code based on model.js template and migrations
		var code = _.template(fs.readFileSync(modelTemplateFile,'utf8'), {
			basename: basename,
			modelConfig: modelConfig,
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

function copyBuiltins() {
	// this method will allow an app to do a require
	// of special built-in alloy libraries that we provide 
	// as part of the framework and then auto-deploy them at 
	// compile time, only copying the libraries that we 
	// actually require in our app - saving space and memory
	var builtInsDir = compileConfig.dir.builtins; 
	
	function alloyFilter(fn) {
		var exclude = ['backbone','underscore'];
		var matches = fn.match(/^alloy\/(.+)$/);
		var builtin, filepath;

		if (matches !== null) {
			builtin = matches[1];
			if (!_.contains(exclude, builtin)) {
				filepath = path.join(builtInsDir,builtin+'.js');
				if (path.existsSync(filepath)) {
					return filepath;
				}
			}
		}
		return null;
	}

	var alloyLibs = [];
	var resourcesDir = compileConfig.dir.resources; 
	var files = wrench.readdirSyncRecursive(resourcesDir);
	_.each(files, function(file) {
		var ext = file.substring(file.length-3);
		if (ext == '.js') {
			var f = path.join(resourcesDir,file);
			// this method will use the AST of the code to resolve all
			// the requires in the code and filter only the ones which are 
			// alloy builtins
			var found = requires.findAllRequires(f,alloyFilter);
			alloyLibs = _.union(alloyLibs,found);
		}
	});
	
	if (alloyLibs.length > 0) {
		// now find all our builtin libs and then copy them into 
		// the project relative to the alloy directory so that 
		// when they are required in the real project they will be available
		var alloyDir = compileConfig.dir.resourcesAlloy; 
		alloyLibs = _.uniq(alloyLibs);
		_.each(alloyLibs,function(lib) {
			// find all dependencies that look to be relative to our dependency
			var depends = requires.findAllRequires(lib);
			var libdir = path.dirname(lib);
			_.each(depends,function(depend) {
				var ext = depend.substring(depend.length-3);
				if (ext == '.js' && depend.substring(0,libdir.length)==libdir)  {
					if (path.existsSync(depend)) {
						var rel = depend.substring(libdir.length);
						var depDest = path.join(alloyDir,rel);
						logger.debug('Copying builtin dependency '+depend.yellow+' to '.cyan+depDest.yellow);
						U.copyFileSync(depend,depDest);
					}
				}
			});
			// now copy our builtin
			var name = path.basename(lib);
			var dest = path.join(alloyDir,name);
			logger.debug('Copying builtin '+lib.yellow+' to '.cyan+dest.yellow);
			U.copyFileSync(lib,dest);
		});
	}
}

function optimizeCompiledCode(config) {
	var resourcesDir =  compileConfig.dir.resources, 
		files = wrench.readdirSyncRecursive(resourcesDir);

	_.each(files,function(file){
		var ext = file.substring(file.length-3);
		if (ext == '.js') {
			var f = path.join(resourcesDir,file);
			logger.debug('Processing generated javascript file "' + file + '"');

			// we fix require paths to make sure they are correct and relative to the project
			var newSrc = requires.makeRequiresRelative(f,resourcesDir,config);
			fs.writeFileSync(f,newSrc,'utf-8');
		}
	});
}