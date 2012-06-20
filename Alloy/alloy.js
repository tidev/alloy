/**
 * Alloy
 * Copyright (c) 2012 by Appcelerator, Inc. All Rights Reserved.
 * See LICENSE for more information on licensing.
 */
var fs = require('fs'),
	path = require('path')
	program = require('commander'),
	logger = require("./common/logger"),
	U = require('./utils'),
	wrench = require("wrench"),
	colors = require("colors"),
	_ = require("./lib/alloy/underscore")._,
	DOMParser = require("xmldom").DOMParser,
	XMLSerializer = require("xmldom").XMLSerializer,
	jsp = require("./uglify-js/uglify-js").parser,
	pro = require("./uglify-js/uglify-js").uglify,
	generators = require('./generators'),
	pkginfo = require('pkginfo')(module, 'name', 'version');

//
//TODO: we need a much more robust help from command line -- see sort of what i did in titanium
//TODO: handle localization files and merging
//

/**
 * ACTIONS:
 *
 * - new [path] - create a new project
 * - compile - compile the project
 * - generate [type] - generate an object such as a model or controller
 */
		
program
	.version(module.exports.version)
	.description('Alloy command line')
	.usage('ACTION [ARGS] [OPTIONS]')
	.option('-o, --outputPath <outputPath>', 'Output path for generated code')
	.option('-l, --logLevel <logLevel>', 'Log level (default: 3 [DEBUG])')
	.option('-d, --dump','Dump the generated app.js to console')
	.option('-f, --force','Force the command to execute')
	.option('-n, --no-colors','Turn off colors')
	.option('-c, --config <config>','Pass in compiler configuration')
	.parse(process.argv);

var outputPath,
	compilerMakeFile,
	alloyUniqueIdPrefix = '__alloyId',
	alloyUniqueIdCounter = 0;
	
function CompilerMakeFile()
{
	var handlers = {};
	
	this.require = require;
	this.process = process;
	
	this.task = function(event, fn)
	{
		logger.debug('adding task: '+event.yellow);
		handlers[event] = fn;
	};
	
	this.trigger = function(event, config)
	{
		logger.debug("compile:trigger-> "+event.yellow);
		var fn = handlers[event];
		if (fn)
		{
			return fn(config,logger);
		}
		return null;
	};
	
	return this;
}	

function generateVarName(id)
{
	return '$.'+id;
}

function die(msg, printUsage) 
{
	printUsage = typeof printUsage === 'undefined' ? false : printUsage;
	logger.error(msg);
	if (printUsage) {
		logger.info(program.helpInformation());
	}
	process.exit(1);
}

function loadStyle(p)
{
	if (path.existsSync(p))
	{
		var f = fs.readFileSync(p);
		f = String(f);

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
			die("Error parsing style at "+p.yellow+".  Error was: "+String(E).red);
		}
	}
	return {};
}

function banner()
{
	var str = 
	"       .__  .__                \n"+
	"_____  |  | |  |   ____ ___.__.\n"+
	"\\__  \\ |  | |  |  /  _ <   |  |\n"+
	" / __ \\|  |_|  |_(  <_> )___  |\n"+
	"(____  /____/____/\\____// ____|\n"+
	"     \\/                 \\/";
	
	if (!program.dump)
	{
		console.log(logger.stripColors ? str : str.blue);
		var m = "Alloy by Appcelerator. The MVC app framework for Titanium.\n".white;
		console.log(logger.stripColors ? colors.stripColors(m) : m);
	}
}

function compile(args)
{
	var inputPath = args.length > 0 ? args[0] : resolveAppHome();
	var alloyCF = path.join(inputPath,'alloy.json');
	var generatedCFG = '';
	var alloyConfig = {};

	if (!path.existsSync(inputPath)) 
	{
		die('inputPath "' + inputPath + '" does not exist');
	}	

	if (!program.outputPath)
	{
		var t = path.join(inputPath,'views','index.xml');
		if (path.existsSync(t))
		{
			outputPath = path.join(inputPath,'..');
		}
	}
	outputPath = outputPath ? outputPath : (program.outputPath || path.join(resolveAppHome(),".."));
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
		die("Couldn't find expected views directory at '"+viewsDir+"'");
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
		die("Couldn't find expected index view at '"+indexView+"'");
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
		var lib = path.join(__dirname,'lib');
		U.copyFilesAndDirs(lib,resourcesDir);
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
		if (!path.existsSync(viewFile))
		{
			return false;
		}

		var styleFile = path.join(sd,viewName+".json");
		var styles = loadStyle(styleFile);
		state.styles = styles;

		var xml = fs.readFileSync(viewFile);
		var doc = new DOMParser().parseFromString(String(xml));
		var docRoot = doc.documentElement;

		var id = viewid || doc.documentElement.getAttribute('id') || viewName;
		var parentNode = state.parentNode;

		if (viewName=='index')
		{
			template.viewCode += findAndLoadModels(state);
		}

		if (docRoot.nodeName === 'App') {
			for (var i = 0, l = docRoot.childNodes.length; i < l; i++) {
				template.viewCode += generateNode(false,viewFile,docRoot.childNodes.item(i),state,viewid||viewname);
			}
		} else {
			template.viewCode += generateNode(false,viewFile,doc.documentElement,state,viewid||viewName);
		}
		template.controllerCode += generateController(viewName,dir,state,id);

		// create commonjs module for this view/controller
		var code = _.template(fs.readFileSync(path.join(outputPath, 'app', 'template', 'controller.js'), 'utf8'), template);
		code = U.processSourceCode(code, alloyConfig);
		if (isWidget) {
			wrench.mkdirSyncRecursive(path.join(outputPath, 'Resources', 'alloy', 'widgets', wJSon.id, 'components'), 0777);
			fs.writeFileSync(path.join(outputPath, 'Resources', 'alloy', 'widgets', wJSon.id, 'components', viewName + '.js'), code);
		} else {
			fs.writeFileSync(path.join(outputPath, 'Resources', 'alloy', 'components', viewName + '.js'), code);
		}
	}
	
	var state = {
		parentNode: null
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
	//generateSourceCode();

	// generate app.js
	var appJS = path.join(resourcesDir,"app.js");
	var code = _.template(fs.readFileSync(path.join(outputPath,'app','template','app.js'),'utf8'),{config:generatedCFG});
	code = U.processSourceCode(code, alloyConfig);

	// trigger our custom compiler makefile
	var njs = compilerMakeFile.trigger("compile:app.js",_.extend(_.clone(compileConfig), {"code":code, "appJSFile" : path.resolve(appJS)}));
	if (njs) {
		code = njs;
	}
	
	fs.writeFileSync(appJS,code);
	logger.info("compiling alloy to " + appJS.yellow);

	if (program.dump) console.log(final_code.blue);

	// trigger our custom compiler makefile
	compilerMakeFile.trigger("post:compile",_.extend(_.clone(compileConfig), {state:state}));
}

function resolveAppHome()
{
	var f = path.join("./","app");
	if (path.existsSync(f))
	{
		return f;
	}
	die("This directory: "+f+" does not look like an Alloy directory");
}

function generate(args)
{
	if (args.length === 0) {
		die("generate requires a TYPE such as 'controller' as second argument");
	} else if (args.length === 1) {
		die("generate requires a NAME such as third argument");
	}

	var targets = ['controller', 'view', 'model', 'migration', 'widget'];	
	var target = args[0];	
	var name = args[1];

	if (!_.contains(targets, target)) 
	{
		die(
			'Invalid generate target "' + target + '"\n' + 
			'Must be one of the following: [' + targets.join(',') + ']'
		);
	}

	var home = resolveAppHome();
	var newargs = args.slice(1);
	var funcName = 'generate' + target.charAt(0).toUpperCase() + target.slice(1);
	generators[funcName](home,newargs,name,program.force);	
}

function run(args)
{
	if (process.platform != 'darwin')
	{
		die("Sorry, Alloy doesn't yet support the `run` command on this platform (" + process.platform + ")");
	}
	
	var inputPath = path.resolve(args.length > 0 ? args[0] : resolveAppHome());
	
	if (!path.existsSync(inputPath)) 
	{
		die('inputPath "' + inputPath + '" does not exist');
	}
	
	if (U.isTiProject(inputPath))
	{
		inputPath = path.join(inputPath,'app');
		if (!path.existsSync(inputPath))
		{
			die("This project doesn't seem to contain an Alloy app");
		}
	}
		
	var platform = args.length > 1 ? args[1] : 'iphone'; // TODO: check tiapp.xml for <deployment-targets>
	
	var sdkRoot = path.resolve('/Library/Application Support/Titanium/mobilesdk/osx')
	if (path.existsSync(sdkRoot))
	{
		var dirs = fs.readdirSync(sdkRoot);
		if (dirs.length > 0)
		{
			// sort and get the latest if we don't pass it in
			dirs = dirs.sort();
			sdkRoot = path.join(sdkRoot, dirs[dirs.length-1]);
		}
	}
	
	if (sdkRoot && path.existsSync(sdkRoot))
	{
		function trim(line)
		{
			return String(line).replace(/^\s\s*/, '').replace(/\s\s*$/, '');
		}
		function filterLog(line)
		{
			line =trim(line);
			if (!line) return;
			var lines = line.split('\n');
			if (lines.length > 1)
			{
				_.each(lines,function(l){
					filterLog(l);
				});
				return;
			}
			var idx = line.indexOf(' -- [');
			if (idx > 0)
			{
				var idx2 = line.indexOf(']', idx+7);
				line = line.substring(idx2+1);
			}
			if (line.charAt(0)=='[')
			{
				var i = line.indexOf(']');
				var label = line.substring(1,i);
				var rest = trim(line.substring(i+1));
				if (!rest) return;
				switch(label)
				{
					case 'INFO':
					{
						logger.info(rest);
						return;
					}
					case 'TRACE':
					case 'DEBUG':
					{
						logger.debug(rest);
						return;
					}
					case 'WARN':
					{
						logger.warn(rest);
						return;
					}
					case 'ERROR':
					{
						logger.error(rest);
						return;
					}
				}
			}
			logger.debug(line);
		}

		var spawn = require('child_process').spawn;
		
		//run the project using titanium.py
		var runcmd = spawn('python', [
			path.join(sdkRoot,'titanium.py'),
			'run',
			'--dir=' + inputPath ,
			'--platform=' + platform
		],process.env);
		
		//run stdout/stderr back through console.log
		runcmd.stdout.on('data', function (data) {
			filterLog(data);
		});

		runcmd.stderr.on('data', function (data) {
			filterLog(data);
		});

		runcmd.on('exit', function (code) {
		  	logger.info('Finished with code ' + code);
		});
	}
	else
	{
		die("Couldn't find Titanium SDK at "+sdkRoot);
	}
}

function main(args)
{
	logger.stripColors = (program.colors==false);
	
	banner();
	
	if (args.length == 0)
	{
		die('You must supply an ACTION as the first argument');
	}
	
	var action = args[0],
		newargs = args.slice(1);
	
	switch(action)
	{
		case 'new':
		{
			(require('./commands/new'))(newargs, program);
			break;
		}
		case 'compile':
		{
			compile(newargs);
			break;
		}
		case 'generate':
		{
			generate(newargs);
			break;
		}
		case 'run':
		{
			run(newargs);
			break;
		}
		default:
		{
			die('Unknown action: '+action.red);
		}
	}
	
}

main(program.args);
