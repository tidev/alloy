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
	CU = require('./compilerUtils');

var alloyRoot = path.join(__dirname,'..','..'),
	compileConfig = {};

//////////////////////////////////////
////////// command function //////////
//////////////////////////////////////
module.exports = function(args, program) {
	var inputPath = args.length > 0 ? args[0] : U.resolveAppHome(),
		alloyConfigPath = path.join(inputPath,'config','alloy.json'),
		generatedCFG = '',
		alloyConfig = {},
		outputPath, tmpPath, compilerMakeFile;

	// validate input and output paths
	if (!fs.existsSync(inputPath)) {
		U.die('inputPath "' + inputPath + '" does not exist');
	}	
	if (!program.outputPath) {
		tmpPath = path.join(inputPath,'views','index.xml');
		if (fs.existsSync(tmpPath)) {
			outputPath = path.join(inputPath,'..');
		}
	}
	outputPath = outputPath ? outputPath : (program.outputPath || path.join(U.resolveAppHome(),".."));
	U.ensureDir(outputPath);

	// construct compiler config from alloy.json and the command line config parameters
	if (fs.existsSync(alloyConfigPath)) {
		alloyConfig = JSON.parse(fs.readFileSync(alloyConfigPath, 'utf8'));
		logger.info("found alloy configuration at " + alloyConfigPath.yellow);
	}
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
	if (fs.existsSync(alloyJMK)) {
		logger.info("Found project specific makefile at " + "app/alloy.jmk".yellow);
		var vm = require('vm'),
			util = require('util');
		var script = vm.createScript(fs.readFileSync(alloyJMK), 'alloy.jmk');
		
		try {
			script.runInNewContext(compilerMakeFile);
		} catch(E) {
			logger.error("project build at "+alloyJMK.yellow + " generated an error during load: "+E.red);
		}
	}
	
	// trigger our custom compiler makefile
	compilerMakeFile.trigger("pre:compile",_.clone(compileConfig));

	// create components directory for view/controller components
	U.copyAlloyDir(alloyRoot, 'lib', compileConfig.dir.resources); 
	wrench.mkdirSyncRecursive(path.join(compileConfig.dir.resourcesAlloy, 'components'), 0777);
	wrench.mkdirSyncRecursive(path.join(compileConfig.dir.resourcesAlloy, 'widgets'), 0777);

	// Process all views, including all those belonging to widgets
	var viewCollection = U.getWidgetDirectories(outputPath);
	viewCollection.push({ dir: path.join(outputPath,'app') });
	_.each(viewCollection, function(collection) {
		_.each(fs.readdirSync(path.join(collection.dir,'views')), function(view) {
			if (/\.xml$/.test(view)) {
				var basename = path.basename(view, '.xml');
				parseView(basename, collection.dir, basename, collection.manifest);
			}
		});
	});

	// copy assets and libraries
	U.copyAlloyDir(inputPath, ['assets','lib'], compileConfig.dir.resources);
	U.copyAlloyDir(inputPath, 'vendor', path.join(compileConfig.dir.resources,'vendor'));

	// generate app.js
	var appJS = path.join(compileConfig.dir.resources,"app.js");
	var code = _.template(fs.readFileSync(path.join(alloyRoot,'template','app.js'),'utf8'),{});
	code = U.processSourceCode(code, alloyConfig, 'app.js');

	// trigger our custom compiler makefile
	var njs = compilerMakeFile.trigger("compile:app.js",_.extend(_.clone(compileConfig), {"code":code, "appJSFile" : path.resolve(appJS)}));
	if (njs) {
		code = njs;
	}
	fs.writeFileSync(appJS,code);
	logger.info("compiling alloy to " + appJS.yellow);

	// copy builtins and fix their require paths
	copyBuiltins();
	optimizeCompiledCode(alloyConfig);

	// trigger our custom compiler makefile
	compilerMakeFile.trigger("post:compile",_.clone(compileConfig));
};


///////////////////////////////////////
////////// private functions //////////
///////////////////////////////////////
function parseView(viewName,dir,viewid,manifest) {
	var template = {
		viewCode: '',
		controllerCode: '',
		lifecycle: '' 
	};
	var state = { parent: {} };
	var vd = dir ? path.join(dir,'views') : compileConfig.dir.views; 
	var sd = dir ? path.join(dir,'styles') : compileConfig.dir.styles; 

	var viewFile = path.join(vd,viewName+".xml");
	if (!fs.existsSync(viewFile)) {
		logger.warn('No XML view file found for view ' + viewFile);
		return;
	}

	var styleFile = path.join(sd,viewName+".json");
	var styles = CU.loadStyle(styleFile);
	state.styles = styles;

	var xml = fs.readFileSync(viewFile,'utf8');
	var doc = new DOMParser().parseFromString(xml);

	// Give our document the <Alloy> root element if it doesn't already have one
	if (doc.documentElement.nodeName !== 'Alloy') {
		var tmpDoc = new DOMParser().parseFromString('<Alloy></Alloy>');
		tmpDoc.documentElement.appendChild(doc.documentElement);
		doc = tmpDoc;
	}
	var docRoot = doc.documentElement;
	var id = viewid || doc.documentElement.getAttribute('id') || viewName;

	// TODO: Can we move this out of the parseView() call?
	if (viewName === 'index') {
		template.viewCode += findAndLoadModels();
	}

	// Generate Titanium code from the markup
	var rootChildren = U.XML.getElementsFromNodes(docRoot.childNodes);
	for (var i = 0, l = rootChildren.length; i < l; i++) {
		template.viewCode += CU.generateNode(
			rootChildren[i],
			state,
			i === 0 ? (viewid||viewName) : undefined,
			i === 0);
	}
	template.controllerCode += generateController(viewName,dir,id);

	// create commonjs module for this view/controller
	var code = _.template(fs.readFileSync(path.join(compileConfig.dir.template, 'component.js'), 'utf8'), template);
	try {
		code = U.processSourceCode(code, compileConfig.alloyConfig, viewName+'.js');
	} catch (e) {
		logger.error(code);
		U.die(e);
	}

	if (manifest) {
		wrench.mkdirSyncRecursive(path.join(compileConfig.dir.resourcesAlloy, 'widgets', manifest.id, 'components'), 0777);
		CU.copyWidgetAssets(path.join(dir,'assets'), compileConfig.dir.resources, manifest.id);
		fs.writeFileSync(path.join(compileConfig.dir.resourcesAlloy, 'widgets', manifest.id, 'components', viewName + '.js'), code);
	} else {
		fs.writeFileSync(path.join(compileConfig.dir.resourcesAlloy, 'components', viewName + '.js'), code);
	}
}

function generateController(name, dir, id) {
	var controllerDir = dir ? path.join(dir,'controllers') : compileConfig.dir.controllers, 
		p = path.join(controllerDir,name+'.js'),
		code = '';
	
	if (fs.existsSync(p)) {
		return fs.readFileSync(p,'utf8');
	} else {
		return '';
	}
}

function findModelMigrations(name) {
	try {
		var migrationsDir = compileConfig.dir.migrations;
		var files = fs.readdirSync(migrationsDir);
		var part = '_'+name+'.js';

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

function findAndLoadModels() {
	var f = compileConfig.dir.models; 
	var code = '';
	if (!fs.existsSync(f)) {
		wrench.mkdirSyncRecursive(f, 777);
	}		

	var files = fs.readdirSync(f);
	for (var c=0;c<files.length;c++) {
		var file = files[c];
		if (file.indexOf(".json")>0) {
			var fpath = path.join(f,file);
			var part = file.substring(0,file.length-5);
			var modelJs = path.join(f,part+'.js');

			var jm = fs.readFileSync(fpath);
			var js = "";
			try {
				var stats = fs.lstatSync(modelJs);
				if (stats.isFile()) {
					js = fs.readFileSync(modelJs,'utf8');
				}
			}
			catch(E) { }

			var migrations = findModelMigrations(part);
			var theid = U.properCase(part), theidc = U.properCase(part)+'Collection';
			var symbol1 =  CU.generateVarName(theid);
			var symbol2 =  CU.generateVarName(theidc);
			var codegen = symbol1 + " = M$('"+ part +"',\n" +
							jm + "\n" +
						  ", function("+part+"){\n" +
							js + "\n" +
						  "},\n" + 
						  "[ " + migrations.join("\n,") + " ]\n" +  
						  ");\n";

			codegen+=symbol2 + " = BC$.extend({model:" + symbol1 + "});\n";
			codegen+=symbol2+".prototype.model = " + symbol1+";\n";
			codegen+=symbol2+".prototype.config = " + symbol1+".prototype.config;\n";
		
			code += codegen;
		}
	}

	return code;
}

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
				if (fs.existsSync(filepath)) {
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
					if (fs.existsSync(depend)) {
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