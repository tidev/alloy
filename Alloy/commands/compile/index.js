var path = require('path'),	
	colors = require('colors'),
	fs = require('fs'),
	wrench = require('wrench'),
	DOMParser = require("xmldom").DOMParser,
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

	// TODO: remove this once the this is merged: https://github.com/appcelerator/titanium_mobile/pull/2610
	// Make sure that ti.physicalSizeCategory is installed
	if (!path.existsSync(path.join(outputPath,'ti.physicalSizeCategory-android-1.0.zip')) && 
		!path.existsSync(path.join(outputPath,'modules','android','ti.physicalsizecategory','1.0','timodule.xml'))) {
		wrench.copyDirSyncRecursive(path.join(alloyRoot,'modules'), outputPath, {preserve:true})
	}
	U.installModule(outputPath, {
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
		U.die('Error processing global style at "' + globalStylePath + '"');
	}

	// Process all models
	var models = processModels();

	// include all necessary widgets
	// TODO: include widgets automatically

	// Process all views, including all those belonging to widgets
	var viewCollection = U.getWidgetDirectories(outputPath);
	viewCollection.push({ dir: path.join(outputPath,CONST.ALLOY_DIR) });
	_.each(viewCollection, function(collection) {
		_.each(wrench.readdirSyncRecursive(path.join(collection.dir,CONST.DIR.VIEW)), function(view) {
			if (viewRegex.test(view)) {
				parseView(view, collection.dir, collection.manifest);
			}
		});
	});

	// copy assets and libraries
	U.copyAlloyDir(inputPath, [CONST.DIR.ASSETS,CONST.DIR.LIB], compileConfig.dir.resources);
	U.copyAlloyDir(inputPath, CONST.DIR.VENDOR, path.join(compileConfig.dir.resources,CONST.DIR.VENDOR));

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
// function parseView(viewName,dir,viewId,manifest) {
function parseView(view,dir,manifest) {
	// validate parameters
	if (!view) { U.die('Undefined view passed to parseView()'); }
	if (!dir) { U.die('Failed to parse view "' + view + '", no directory given'); }

	var basename = path.basename(view, '.'+CONST.FILE_EXT.VIEW);
		dirname = path.dirname(view),
		viewName = basename,
		viewId = basename,
		template = {
			viewCode: '',
			controllerCode: '',
			//initFunction: ''
		},
		state = { parent: {} },
		files = {};

	// create a list of file paths
	_.each(['VIEW','STYLE','CONTROLLER'], function(fileType) {
		var tmp = path.join(dir,CONST.DIR[fileType]);
		if (dirname) { tmp = path.join(tmp,dirname); }
		files[fileType] = path.join(tmp,viewName+'.'+CONST.FILE_EXT[fileType]);
	});
	files.COMPONENT = path.join(compileConfig.dir.resourcesAlloy,CONST.DIR.COMPONENT);
	if (dirname) { files.COMPONENT = path.join(files.COMPONENT,dirname); }
	files.COMPONENT = path.join(files.COMPONENT,viewName+'.js');

	// validate view
	if (!path.existsSync(files.VIEW)) {
		logger.warn('No ' + CONST.FILE_EXT.VIEW + ' view file found for view ' + files.VIEW);
		return;
	}

	// Load the style and update the state
	try {
		state.styles = CU.loadAndSortStyle(files.STYLE);
	} catch (e) {
		U.die([
			e.stack,
			'Error processing style at "' + files.STYLE + '"'
		]);
	}

	// read and parse the view file
	var xml = fs.readFileSync(files.VIEW,'utf8');
	var doc = new DOMParser().parseFromString(xml);

	// Give our document the <Alloy> root element if it doesn't already have one
	if (doc.documentElement.nodeName !== CONST.ROOT_NODE) {
		var tmpDoc = new DOMParser().parseFromString('<' + CONST.ROOT_NODE + '></' + CONST.ROOT_NODE + '>');
		tmpDoc.documentElement.appendChild(doc.documentElement);
		doc = tmpDoc;
	}
	var docRoot = doc.documentElement;
	var id = viewId || doc.documentElement.getAttribute('id') || viewName;

	// Generate Titanium code from the markup
	var rootChildren = U.XML.getElementsFromNodes(docRoot.childNodes);
	
	// make sure we have a Window, TabGroup, or SplitWindow
	if (viewName === 'index') {
		var found = _.find(rootChildren, function(node) {
			var ns = node.getAttribute('ns') || CONST.NAMESPACE_DEFAULT;
			return node.nodeName === 'Window' ||
			       node.nodeName === 'SplitWindow' ||
			       node.nodeName === 'TabGroup';
		});
		if (!found) {
			U.die([
				'Compile failed. index.xml must have a top-level container element.',
				'Valid elements: [ Window, TabGroup, SplitWindow]'
			]);
		}
	}

	// Generate each node in the view
	for (var i = 0, l = rootChildren.length; i < l; i++) {
		template.viewCode += CU.generateNode(
			rootChildren[i],
			state,
			i === 0 ? (viewId||viewName) : undefined,
			i === 0);
	}
	template.controllerCode += CU.loadController(files.CONTROLLER);

	//var codeObj = optimizer.dissectController(template.controllerCode);
	//template.controllerCode = codeObj.post;
	//template.initFunction = codeObj.init;

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
		var widgetDir = dirname ? path.join(CONST.DIR.COMPONENT,dirname) : CONST.DIR.COMPONENT;
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

			// we fix require paths to make sure they are correct and relative to the project
			var newSrc = requires.makeRequiresRelative(f,resourcesDir,config);
			fs.writeFileSync(f,newSrc,'utf-8');
		}
	});
}