var path = require('path'),	
	colors = require('colors'),
	fs = require('fs'),
	wrench = require('wrench'),
	U = require('../utils'),
	_ = require("../lib/alloy/underscore")._,
	DOMParser = require("xmldom").DOMParser,
	logger = require('../common/logger'),
	requires = require('../requires'),
	CompilerMakeFile = require('../CompilerMakeFile');

var outputPath,
	compilerMakeFile,
	alloyUniqueIdPrefix = '__alloyId',
	alloyUniqueIdCounter = 0;

function compile(args, program) {
	var inputPath = args.length > 0 ? args[0] : U.resolveAppHome();
	var alloyCF = path.join(inputPath,'config','alloy.json');
	var generatedCFG = '';
	var alloyConfig = {};

	if (!path.existsSync(inputPath)) {
		U.die('inputPath "' + inputPath + '" does not exist');
	}	

	if (!program.outputPath)
	{
		var t = path.join(inputPath,'views','index.xml');
		if (path.existsSync(t))
		{
			outputPath = path.join(inputPath,'..');
		}
	}
	outputPath = outputPath ? outputPath : (program.outputPath || path.join(U.resolveAppHome(),".."));
	U.ensureDir(outputPath);

	// construct compiler config from alloy.json and the command line config parameters
	if (path.existsSync(alloyCF)) {
		alloyConfig = JSON.parse(fs.readFileSync(alloyCF, 'utf8'));
		logger.info("found alloy configuration at "+alloyCF.yellow);
	}
	if (program.config) {
		_.each(program.config.split(','), function(v) {
			var a = v.split('=');
			alloyConfig[a[0]]=a[1];
		});
	}
	alloyConfig.deploytype = alloyConfig.deploytype || 'development';
	alloyConfig.beautify = alloyConfig.beautify || alloyConfig.deploytype === 'development';

	//console.log(alloyConfig);

	// establish alloy app directories
	var viewsDir = path.join(inputPath,'views');
	if (!path.existsSync(viewsDir)) {
		U.die("Couldn't find expected views directory at '"+viewsDir+"'");
	}
	var stylesDir = path.join(inputPath,'styles');
	var controllersDir = path.join(inputPath,'controllers');
	var widgetsDir = path.join(inputPath,'widgets');
	var modelsDir = path.join(inputPath,'models');
	var migrationsDir = path.join(inputPath,'migrations');
	var configDir = path.join(inputPath,'config');
	var assetsDir = path.join(inputPath,'assets');

	// generate $.CFG from config.json, if present
	// TODO: $.CFG doesn't seem like a good idea for the variable name, since
	//       $ is used for each component object. Perhaps the generated config
	//       should be accessed via commonjs module. This ensures that it is 
	//       only generated/loaded once and will be "global" to all project
	//       resources.
	generatedCFG = U.generateConfig(configDir, alloyConfig);

	// make sure we have a root index view
	var indexView = path.join(viewsDir,"index.xml");
	if (!path.existsSync(indexView)) {
		U.die("Couldn't find expected index view at '"+indexView+"'");
	}

	// make sure we have a Resources directory in the output path
	var resourcesDir = path.join(outputPath,"Resources");
	U.ensureDir(resourcesDir);
	
	logger.info("Generating to "+resourcesDir.yellow+" from ".cyan + inputPath.yellow);

	// setup the compiler makefile
	compilerMakeFile = new CompilerMakeFile();
	var compileConfig = 
	{
		alloyConfig: alloyConfig,
		home: path.resolve(inputPath),
		projectDir : path.resolve(outputPath),
		viewsDir: path.resolve(viewsDir),
		controllersDir: path.resolve(controllersDir),
		widgetsDir: path.resolve(widgetsDir),
		modelsDir: path.resolve(modelsDir),
		migrationsDir: path.resolve(migrationsDir),
		resourcesDir: path.resolve(resourcesDir),
		assetsDir: path.resolve(assetsDir),
		configDir:path.resolve(configDir)
	};
	
	var alloyJMK = path.resolve(path.normalize(path.join(inputPath,"alloy.jmk")));
	if (path.existsSync(alloyJMK))
	{
		logger.info("Found project specific makefile at " + "app/alloy.jmk".yellow);
		var vm = require('vm'),
			util = require('util');
		var script = vm.createScript(fs.readFileSync(alloyJMK), 'alloy.jmk');
		try
		{
			script.runInNewContext(compilerMakeFile);
		}
		catch(E)
		{
			logger.error("project build at "+alloyJMK.yellow + " generated an error during load: "+E.red);
		}
	}
	
	// trigger our custom compiler makefile
	compilerMakeFile.trigger("pre:compile",_.clone(compileConfig));

	function loadStyle(p)
	{
		if (path.existsSync(p))
		{
			var f = fs.readFileSync(p, 'utf8');

			// skip empty files
			if (/^\s*$/.test(f)) {
				return {};
			}

			f = f.replace(/Titanium\./g,"Ti.");
			// fixup constants so we can use them in JSON but then we do magic conversions
			f = f.replace(/Ti\.UI\.FILL/g,'"TI_UI_FILL"');
			f = f.replace(/Ti\.UI\.SIZE/g,'"TI_UI_SIZE"');
			f = f.replace(/Ti\.UI\.TEXT_ALIGNMENT_LEFT/g,'"TI_UI_TEXT_ALIGNMENT_LEFT"')
			f = f.replace(/Ti\.UI\.TEXT_ALIGNMENT_RIGHT/g,'"TI_UI_TEXT_ALIGNMENT_RIGHT"')
			f = f.replace(/Ti\.UI\.TEXT_ALIGNMENT_CENTER/g,'"TI_UI_TEXT_ALIGNMENT_CENTER"')
			try 
			{
				return JSON.parse(f);
			}
			catch(E)
			{
				U.die("Error parsing style at "+p.yellow+".  Error was: "+String(E).red);
			}
		}
		return {};
	}

	function generateVarName(id)
	{
		return '$.'+id;
	}

	function copyAssets()
	{
		if (path.existsSync(assetsDir))
		{
			logger.info('Copying assets from: '+assetsDir.yellow);
			U.copyFilesAndDirs(assetsDir,resourcesDir);
		}
	}

	function copyLibs()
	{
		var lib = path.join(inputPath,'lib');
		if (path.existsSync(lib))
		{
			logger.info('Copying app libs: '+lib.yellow);
			U.copyFilesAndDirs(lib,resourcesDir);
		}
		var vendor = path.join(inputPath,'vendor');
		var vendorTarget = path.join(resourcesDir,'vendor');
		if (path.existsSync(vendor))
		{
			logger.info('Copying vendor libs: '+vendor.yellow);
			wrench.mkdirSyncRecursive(vendorTarget, 0777);
			U.copyFilesAndDirs(vendor,vendorTarget);
		}
	}

	function copyAlloy()
	{
		var lib = path.join(__dirname,'..','lib');
		U.copyFilesAndDirs(lib,resourcesDir);
	}

	function copyBuiltins()
	{
		// this method will allow an app to do a require
		// of special built-in alloy libraries that we provide 
		// as part of the framework and then auto-deploy them at 
		// compile time, only copying the libraries that we 
		// actually require in our app - saving space and memory
		var builtInsDir = path.join(__dirname,'..','builtins');
		function alloyFilter(fn)
		{
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
		var resourcesDir = path.join(outputPath,'Resources');
		var files = wrench.readdirSyncRecursive(resourcesDir);
		_.each(files,function(file){
			var ext = file.substring(file.length-3);
			if (ext == '.js')
			{
				var f = path.join(resourcesDir,file);
				// this method will use the AST of the code to resolve all
				// the requires in the code and filter only the ones which are 
				// alloy builtins
				var found = requires.findAllRequires(f,alloyFilter);
				_.extend(alloyLibs,found);
			}
		});
		
		if (alloyLibs.length > 0)
		{
			// now find all our builtin libs and then copy them into 
			// the project relative to the alloy directory so that 
			// when they are required in the real project they will be available
			var alloyDir = path.join(resourcesDir,'alloy');
			alloyLibs = _.uniq(alloyLibs);
			_.each(alloyLibs,function(lib)
			{
				// find all dependencies that look to be relative to our dependency
				var depends = requires.findAllRequires(lib);
				var libdir = path.dirname(lib);
				_.each(depends,function(depend)
				{
					var ext = depend.substring(depend.length-3);
					if (ext == '.js' && depend.substring(0,libdir.length)==libdir) 
					{
						if (path.existsSync(depend))
						{
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
	
	function fixRequirePaths(config)
	{
		var resourcesDir = path.join(outputPath,'Resources');
		var files = wrench.readdirSyncRecursive(resourcesDir);
		_.each(files,function(file){
			var ext = file.substring(file.length-3);
			if (ext == '.js')
			{
				var f = path.join(resourcesDir,file);
				// we fix require paths to make sure they are correct and relative to the project
				var newSrc = requires.makeRequiresRelative(f,resourcesDir,config);
				fs.writeFileSync(f,newSrc,'utf-8');
			}
		});
	}

	var JSON_NULL = JSON.parse('null');

	function mergeStyles(from,to)
	{
		if (from)
		{
			for (var k in from)
			{
				var v = from[k];
				// for optimization, remove null or undefined values
				if (v == JSON_NULL || typeof(v)==='undefined' || typeof(v)==='null')
				{
					delete to[k];
				}
				else
				{
					to[k] = from[k];
				}
			}
		}
	}

	function properCase (n)
	{
		return n.charAt(0).toUpperCase() + n.substring(1);
	}

	function generateStyleParams(styles,classes,id,className)
	{
		var s = {};
		mergeStyles(styles['View'],s);
		mergeStyles(styles[properCase(className)],s);
		for (var c=0;c<classes.length;c++)
		{
			var clsn = classes[c];
			mergeStyles(styles['.'+clsn],s);
		}
		mergeStyles(styles['#'+id],s);
		if (id) s['id'] = id;
		var str = [];
		
		var constants = {
			'TI_UI_FILL':'Ti.UI.FILL',
			'TI_UI_SIZE':'Ti.UI.SIZE',
			'TI_UI_TEXT_ALIGNMENT_LEFT':'Ti.UI.TEXT_ALIGNMENT_LEFT',
			'TI_UI_TEXT_ALIGNMENT_CENTER':'Ti.UI.TEXT_ALIGNMENT_CENTER',
			'TI_UI_TEXT_ALIGNMENT_RIGHT':'Ti.UI.TEXT_ALIGNMENT_RIGHT'
		};
		
		for (var sn in s)
		{
			var v = s[sn];
			var q = typeof(v) === 'string';
			var cf = constants[v];
			if (cf) {
				str.push("\t\t"+sn+':'+cf);
			} else if (q) {
				str.push("\t\t"+sn+':'+'"'+v+'"');
			} else {
				str.push("\t\t"+sn+':'+ JSON.stringify(v));
			}
		}
		return str.join(",\n");
	}

	function generateController(name, dir, state, id)
	{
		var code = '';
		var cd = dir ? path.join(dir,'controllers') : controllersDir;
		var p = path.join(cd,name+'.js');
		var symbol = generateVarName(id);
		
		if (path.existsSync(p)) {
			var js = fs.readFileSync(p);
			return js;
		} else {
			return '';
		}
	}

	function generateUniqueId() {
		return alloyUniqueIdPrefix + alloyUniqueIdCounter++;
	};

	function generateNode(ischild,viewFile,node,state,defId)
	{
		if (node.nodeType != 1) return '';

		var code = '';
		var req = node.getAttribute('require');

		// TODO: may need to rethink including "req" here. It simplifies usage,
		//       but will cause complications when views/widgets are used more than
		//       once in a view.
		var id = node.getAttribute('id') || defId || req || generateUniqueId();
		var symbol = generateVarName(id);
		var nodename = node.nodeName;
		var classes = node.getAttribute('class').split(' ');

		if (req) {
			var commonjs = "alloy/components/" + req;
			if (nodename === 'Widget') {
				commonjs = "alloy/widgets/" + req + "/components/widget";
			} 
			code += symbol + " = (require('" + commonjs + "')).create();\n";
			if (!ischild) {
				code += "root$ = " + symbol + ";\n";
			}
			if (state.parentNode) {
				code += symbol + '.setParent(' + state.parentNode + ');\n';
			}
		} else {
			var ns = node.getAttribute('ns') || "Ti.UI";
			var fn = "create" + nodename;
			
			if (node.childNodes.length > 0)
			{
				var processors = 
				[
					['Label','text'],
					['Button','title']
				];
				_.every(processors, function(el)
				{
					if (nodename == el[0])
					{
						var k = el[1];
						var str = U.XML.getNodeText(node);
						if (!state.styles['#'+id])
						{
							state.styles['#'+id]={};
						}
						state.styles['#'+id][k]=str;
						return false;
					} 
					return true;
				});
			}

			code += '\t' + symbol + " = A$(" + ns + "." + fn + "({\n";
			code += generateStyleParams(state.styles,classes,id,node.nodeName);
			code += "\n\t}),'" + node.nodeName + "', " + (state.parentNode || 'null') + ");\n\t";
			if (!ischild) {
				code += "root$ = " + symbol + ";\n";
			}
			if (state.parentNode) {
				code += state.parentNode+".add("+symbol+");\n";
			}
		}

		var childstate = {
			parentNode: symbol,
			styles: state.styles
		};

		for (var c=0;c<node.childNodes.length;c++)
		{
			var child = node.childNodes[c];
			code += generateNode(true,viewFile,child,childstate);
		}

		return code;
	}
	
	function findModelMigrations(state,name)
	{
		try
		{
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
			_.each(files,function(f)
			{
				var mf = path.join(migrationsDir,f);
				var m = fs.readFileSync(mf);
				var code = "(function(migration){\n "+
				           "migration.name = '" + name + "';\n" + 
						   "migration.id = '" + f.substring(0,f.length-part.length).replace(/_/g,'') + "';\n" + 
							String(m) + 
							"})";
				codes.push(code);
			});
			logger.info("Found " + codes.length + " migrations for model: "+name.yellow);
			return codes;
		}
		catch(E)
		{
			return [];
		}
	}
	
	function findAndLoadModels(state) {
		var f = modelsDir;
		var code = '';
		if (!path.existsSync(f)) {
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
						js = fs.readFileSync(modelJs);
					}
				}
				catch(E) { }

				var migrations = findModelMigrations(state,part);

				var theid = properCase(part), theidc = properCase(part)+'Collection';
				var symbol1 =  generateVarName(theid);
				var symbol2 =  generateVarName(theidc);
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

	function parseView(viewName,state,dir,viewid,isWidget,wJSon)
	{
		var template = {
			viewCode: '',
			controllerCode: '',
			lifecycle: '',
			CFG: generatedCFG
		};
		var vd = dir ? path.join(dir,'views') : viewsDir;
		var sd = dir ? path.join(dir,'styles') : stylesDir;

		var viewFile = path.join(vd,viewName+".xml");
		if (!path.existsSync(viewFile)) {
			return false;
		}

		var styleFile = path.join(sd,viewName+".json");
		var styles = loadStyle(styleFile);
		state.styles = styles;

		var xml = fs.readFileSync(viewFile);
		var doc = new DOMParser().parseFromString(String(xml));

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
			template.viewCode += findAndLoadModels(state);
		}

		for (var i = 0, l = docRoot.childNodes.length; i < l; i++) {
			template.viewCode += generateNode(false,viewFile,docRoot.childNodes.item(i),state,viewid||viewname);
		}
		template.controllerCode += generateController(viewName,dir,state,id);

		// create commonjs module for this view/controller
		var code = _.template(fs.readFileSync(path.join(__dirname, '..' , 'template', 'component.js'), 'utf8'), template);
		code = U.processSourceCode(code, alloyConfig);
		if (isWidget) {
			wrench.mkdirSyncRecursive(path.join(outputPath, 'Resources', 'alloy', 'widgets', wJSon.id, 'components'), 0777);
			fs.writeFileSync(path.join(outputPath, 'Resources', 'alloy', 'widgets', wJSon.id, 'components', viewName + '.js'), code);
		} else {
			fs.writeFileSync(path.join(outputPath, 'Resources', 'alloy', 'components', viewName + '.js'), code);
		}
	}
	
	var state = {
		parentNode: null,
		styles: null
	};

	// create components directory for view/controller components
	copyAlloy();
	wrench.mkdirSyncRecursive(path.join(outputPath, 'Resources', 'alloy', 'components'), 0777);
	wrench.mkdirSyncRecursive(path.join(outputPath, 'Resources', 'alloy', 'widgets'), 0777);

	// TODO: Clean up this iteration mess!
	// loop through all widgets
	var widgetPath = path.join(outputPath,'app','widgets');
	if (path.existsSync(widgetPath)) {
		var wFiles = fs.readdirSync(widgetPath);
		for (var i = 0; i < wFiles.length; i++) {
			var wDir = wFiles[i];
			// TODO: make sure wDir is a directory
			var wDirFiles = fs.readdirSync(path.join(widgetPath,wDir));
			for (var j = 0; j < wDirFiles.length; j++) {
				if (_.indexOf(wDirFiles,'widget.json') === -1) {
					break;
				}
			}

			var wReq = JSON.parse(fs.readFileSync(path.join(widgetPath,wDir,'widget.json'),'utf8'));

			// need to loop through all views
			var vFiles = fs.readdirSync(path.join(widgetPath, wDir,'views'));
			for (var k = 0; k < vFiles.length; k++) {
				
				if (/\.xml$/.test(vFiles[k])) {
					var basename = path.basename(vFiles[k], '.xml');
					parseView(basename,state,path.join(widgetPath,wDir),basename,true,wReq);
				}
			}
		}
	}

	// need to loop through all views
	var vFiles = fs.readdirSync(path.join(outputPath,'app','views'));
	for (var i = 0; i < vFiles.length; i++) {
		if (/\.xml$/.test(vFiles[i])) {
			var basename = path.basename(vFiles[i], '.xml');
			parseView(basename,state,null,basename,false);
		}
	}

	copyAssets();
	copyLibs();

	// generate app.js
	var appJS = path.join(resourcesDir,"app.js");
	var code = _.template(fs.readFileSync(path.join(__dirname,'..','template','app.js'),'utf8'),{config:generatedCFG});
	code = U.processSourceCode(code, alloyConfig);

	// trigger our custom compiler makefile
	var njs = compilerMakeFile.trigger("compile:app.js",_.extend(_.clone(compileConfig), {"code":code, "appJSFile" : path.resolve(appJS)}));
	if (njs) {
		code = njs;
	}
	
	fs.writeFileSync(appJS,code);
	logger.info("compiling alloy to " + appJS.yellow);

	copyBuiltins();
	fixRequirePaths(alloyConfig);

	if (program.dump) console.log(code.blue);

	// trigger our custom compiler makefile
	compilerMakeFile.trigger("post:compile",_.extend(_.clone(compileConfig), {state:state}));
};

module.exports = compile;