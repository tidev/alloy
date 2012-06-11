/**
 * Alloy
 * Copyright (c) 2012 by Appcelerator, Inc. All Rights Reserved.
 * See LICENSE for more information on licensing.
 */
var fs = require('fs'),
	path = require('path')
	program = require('commander'),
	logger = require("./common/logger"),
	wrench = require("wrench"),
	colors = require("colors"),
	_ = require("./lib/alloy/underscore")._,
	DOMParser = require("xmldom").DOMParser,
	XMLSerializer = require("xmldom").XMLSerializer,
	jsp = require("./uglify-js/uglify-js").parser,
	pro = require("./uglify-js/uglify-js").uglify;

//
//TODO: we need a much more robust help from command line -- see sort of what i did in titanium
//TODO: handle localization files and merging
//TODO: uglify all files not just our main app.js
//

/**
 * ACTIONS:
 *
 * - new [path] - create a new project
 * - compile - compile the project
 * - generate [type] - generate an object such as a model or controller
 */
		
program
	.version('0.1.0')
	.description('Alloy command line')
	.usage('ACTION [ARGS] [OPTIONS]')
	.option('-o, --outputPath <outputPath>', 'Output path for generated code')
	.option('-l, --logLevel <logLevel>', 'Log level (default: 3 [DEBUG])')
	.option('-d, --dump','Dump the generated app.js to console')
	.option('-f, --force','Force the command to execute')
	.option('-n, --no-colors','Turn off colors')
	.parse(process.argv);

var outputPath,

	JS_COPYRIGHT = "/**\n"+
	     " * Alloy for Titanium by Appcelerator\n" +
	     " * This is generated code, DO NOT MODIFY - change will be lost!\n"+
	     " * Copyright (c) 2012 by Appcelerator, Inc.\n"+
	     " */\n",

	JS = 
		 "var Alloy = require('alloy'),\n" + 
		 "        _ = Alloy._,\n" +
		 "        A$ = Alloy.A,\n" +
		 "        M$ = Alloy.M,\n" +
		 "  Backbone = Alloy.Backbone\n" +
		 ";\n",
	
	JS_EPILOG = "$w.finishLayout();\n$w.open();\n",
	id = 1,
	ids = {};
	
function generateVarName()
{
	return _.uniqueId('$');
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

function ensureDir(p)
{
	if (!path.existsSync(p))
	{
		logger.debug("Creating directory: "+p);
		fs.mkdirSync(p);
	}
}

function getNodeText(node)
{
	var str = '';
	var serializer = new XMLSerializer();
	for (var c=0;c<node.childNodes.length;c++)
	{
		if (node.childNodes[c].nodeType!=1)
		{
			str += serializer.serializeToString(node.childNodes[c]);
		}
	}
	return str;
}

function copyFileSync (srcFile, destFile) 
{
	var BUF_LENGTH = 64 * 1024, 
		buff, 
		bytesRead, 
		fdr, 
		fdw, 
		pos;
	buff = new Buffer(BUF_LENGTH);
	fdr = fs.openSync(srcFile, 'r');
	fdw = fs.openSync(destFile, 'w');
	bytesRead = 1;
	pos = 0;
	while (bytesRead > 0) {
		bytesRead = fs.readSync(fdr, buff, 0, BUF_LENGTH, pos);
		fs.writeSync(fdw, buff, 0, bytesRead);
		pos += bytesRead;
	}
	fs.closeSync(fdr);
	return fs.closeSync(fdw);
}

function appendSource(line)
{
	JS+=line + "\n";
}

function loadStyle(p)
{
	if (path.existsSync(p))
	{
		var f = fs.readFileSync(p);
		f = String(f);
		f = f.replace(/Titanium\./g,"Ti.");
		// fixup constants so we can use them in JSON but then we do magic conversions
		f = f.replace(/Ti\.UI\.FILL/g,'"TI_UI_FILL"');
		f = f.replace(/Ti\.UI\.FIT/g,'"TI_UI_FIT"');
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
		var m = "Alloy by Appcelerator".yellow+"\n";
		console.log(logger.stripColors ? colors.stripColors(m) : m);
	}
}

function compile(args)
{
	var inputPath = args.length > 0 ? args[0] : resolveAppHome();

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
	ensureDir(outputPath);

	var viewsDir = path.join(inputPath,'views');
	if (!path.existsSync(viewsDir))
	{
		die("Couldn't find expected views directory at '"+viewsDir+"'");
	}
	var stylesDir = path.join(inputPath,'styles');
	var controllersDir = path.join(inputPath,'controllers');
	var widgetsDir = path.join(inputPath,'widgets');
	var modelsDir = path.join(inputPath,'models');
	var migrationsDir = path.join(inputPath,'migrations');

	var indexView = path.join(viewsDir,"index.xml");
	if (!path.existsSync(indexView))
	{
		die("Couldn't find expected index view at '"+indexView+"'");
	}
	var resourcesDir = path.join(outputPath,"Resources");
	ensureDir(resourcesDir);

	logger.info("Generating to "+resourcesDir.yellow+" from ".cyan + inputPath.yellow);

	function generateSourceCode()
	{
		var appJS = path.join(resourcesDir,"app.js");
		var code = JS + "\n" + JS_EPILOG;
		
		//FIXME - these need to be passed in
		var defines = {
			OS_IPAD:false
		};

		var ast = jsp.parse(code); // parse code and get the initial AST
		ast = pro.ast_mangle(ast,{except:['Ti','Titanium'],defines:defines}); // get a new AST with mangled names
		ast = pro.ast_squeeze(ast); // get an AST with compression optimizations
		var final_code = pro.gen_code(ast); 
		
		final_code = JS_COPYRIGHT + final_code;
		
		fs.writeFileSync(appJS,final_code);
		logger.info("compiling alloy to " + appJS);

		if (program.dump) console.log(final_code.blue);
	}

	function copyFilesAndDirs(f,d)
	{
		var files = fs.readdirSync(f);
//		logger.info('files returned for '+f+' is '+JSON.stringify(files));
		for (var c=0;c<files.length;c++)
		{
			var file = files[c];
			var fpath = path.join(f,file);
			var stats = fs.lstatSync(fpath);
			var rd = path.join(d,file);
			logger.info('Copying ' + fpath + ' to ' + d);
			if (stats.isDirectory())
			{
				ensureDir(rd);
				wrench.copyDirSyncRecursive(fpath, rd);
			}
			else
			{
				copyFileSync(fpath,rd);
			}
		}
	}

	function copyAssets()
	{
		var assets = path.join(inputPath,'assets');
		if (path.existsSync(assets))
		{
			logger.info('Copying assets from: '+assets);
			copyFilesAndDirs(assets,resourcesDir);
		}
	}

	function copyLibs()
	{
		var lib = path.join(inputPath,'lib');
		if (path.existsSync(lib))
		{
			logger.info('Copying app libs: '+lib);
			copyFilesAndDirs(lib,resourcesDir);
		}
		var vendor = path.join(inputPath,'vendor');
		if (path.existsSync(vendor))
		{
			logger.info('Copying vendor libs: '+vendor);
			copyFilesAndDirs(vendor,path.join(resourcesDir,'vendor'));
		}
	}

	function copyAlloy()
	{
		var lib = path.join(__dirname,'lib');
		copyFilesAndDirs(lib,resourcesDir);
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
		for (var sn in s)
		{
			var v = s[sn];
			var q = typeof(v) === 'string';
			switch(v)
			{
				case 'TI_UI_FILL':
				{
					v = "Ti.UI.FILL";
					q = false;
					break;
				}
				case 'TI_UI_FIT':
				{
					v = "Ti.UI.FIT";
					q = false;
					break;
				}
				case 'TI_UI_TEXT_ALIGNMENT_LEFT':
				{
					v = "Ti.UI.TEXT_ALIGNMENT_LEFT";
					q = false;
					break;
				}
				case 'TI_UI_TEXT_ALIGNMENT_CENTER':
				{
					v = "Ti.UI.TEXT_ALIGNMENT_CENTER";
					q = false;
					break;
				}
				case 'TI_UI_TEXT_ALIGNMENT_RIGHT':
				{
					v = "Ti.UI.TEXT_ALIGNMENT_RIGHT";
					q = false;
					break;
				}
			}
			if (q)
			{
				str.push("   "+sn+':'+'"'+v+'"');
			}
			else
			{
				str.push("   "+sn+':'+v);
			}
		}
		return str.join(",\n");
	}

	function generateController(name, parameters, dir, state, id)
	{
		var cd = dir ? path.join(dir,'controllers') : controllersDir;
		var p = path.join(cd,name+'.js');
//		logger.info('controller: '+p);
		if (path.existsSync(p))
		{
			var js = fs.readFileSync(p);
			var arg1 = [];
			var arg2 = [];
			for (var c=0;c<parameters.length;c++)
			{
				arg1.push(parameters[c][0]);
				arg2.push(parameters[c][1]);
			}

			if (name == 'widget')
			{
				var symbol = generateVarName();
				var src = "var " + symbol + " = (function(exports," + arg2.join(",") + "){\n" + 
						   js + "\n" +
						  "  return exports;\n" + 
				          "})({}," + arg1.join(",") + ");\n";

				var comment = "/**\n" + 
				              " * @widget " + name + "\n" +
				              " */";

				state.parameters.push([symbol,id]);
			}
			else
			{
				var src = "(function(" + arg2.join(",") + "){\n" + 
						   js + "\n" +
				          "})(" + arg1.join(",") + ");\n";

				var comment = "/**\n" + 
				              " * @controller " + name + "\n" +
				              " */";
			}

			appendSource("");
			appendSource(comment);
			appendSource(src);
		}
	}

	function findWidget(id)
	{
		var files = fs.readdirSync(widgetsDir);
		for (var c=0;c<files.length;c++)
		{
			var dirname = files[c];
			var f = path.join(widgetsDir,dirname,'widget.json');
			if (path.existsSync(f))
			{
				var json = fs.readFileSync(f);
				var manifest = JSON.parse(json);
				if (manifest.id == id)
				{
					return [manifest,path.join(widgetsDir,dirname)];
				}
			}
		}
		return null;
	}

	function generateNode(ischild,viewFile,node,state,defId)
	{
		if (node.nodeType != 1) return;

		var id = node.getAttribute('id') || defId;
		var symbol = generateVarName();
		var nodename = node.nodeName;
		var classes = node.getAttribute('class').split(' ');

		switch(nodename)
		{
			case 'View':
			{
				// do a full import if a require tag is used
				var req = node.getAttribute('require');
				if (req)
				{
					parseView(req,state);
					return;
				}
				break;
			}
			case 'Widget':
			{
				// if we're not inside a widget file, then attempt to pull it in
				if (viewFile.indexOf('widget.xml')==-1)
				{
					var req = node.getAttribute('require');
					if (!req)
					{
						die("Widget at '"+viewFile+"' doesn't specify a 'require' attribute which is required");
					}
					var widget = findWidget(req);
					parseView('widget',state,widget[1],id);
					return;
				}
				else
				{
					// a widget should actually get turned into an empty view container
					nodename = 'View';
					break;
				}
			}
		}

		if (ids[id])
		{
			die("<"+nodename+"> from '"+viewFile+"' attempted to use the id '"+id+"' which has already been defined in the view '"+ids[id]+"'");
		}

		ids[id]=viewFile;

		var ns = "Ti.UI";
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
					var str = getNodeText(node);
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

		appendSource("var " + symbol + " = A$(" + ns + "." + fn + "({");
		appendSource(generateStyleParams(state.styles,classes,id,node.nodeName));
		appendSource("}),'" + node.nodeName + "', " + state.parentNode + ");");
		appendSource(state.parentNode+".add("+symbol+");");

		var childstate = {
			parentNode: symbol,
			parameters: state.parameters,
			styles: state.styles,
			models:state.models
		};

		if (id && state.parentNode!=symbol) state.parameters.push([symbol,id]);

		for (var c=0;c<node.childNodes.length;c++)
		{
			var child = node.childNodes[c];
			generateNode(true,viewFile,child,childstate);
		}
	}
	
	function findModelMigrations(state,name)
	{
		try
		{
			var files = fs.readdirSync(migrationsDir);
			var part = '_'+name+'.js';
			// look for our model
			files = _.reject(files,function(f) { return f.indexOf(part)!=-1});
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
				var code = "(function(migration){\n migration.id = '" + f.substring(0,f.length-part.length-1) + "';\n" + String(m) + "})";
				codes.push(code);
			});
			logger.info("Found " + codes.length + " migrations for model: "+name);
			return codes;
		}
		catch(E)
		{
			return [];
		}
	}
	
	function findAndLoadModels(state)
	{
		var f = modelsDir;
		var files = fs.readdirSync(f);
		for (var c=0;c<files.length;c++)
		{
			var file = files[c];
			if (file.indexOf(".json")>0)
			{
				var fpath = path.join(f,file);
				var part = file.substring(0,file.length-5);
				var modelJs = path.join(f,part+'.js');

				var jm = fs.readFileSync(fpath);
				var js = "";
				try
				{
					var stats = fs.lstatSync(modelJs);
					if (stats.isFile())
					{
						js = fs.readFileSync(modelJs);
					}
				}
				catch(E) { }
				
				var migrations = findModelMigrations(state,part);
				
				var symbol1 =  generateVarName();
				var symbol2 =  generateVarName();
				var codegen = "var " + symbol1 + " = M$('"+ part +"',\n" +
								jm + "\n" +
							  ", function("+part+"){\n" +
								js + "\n" +
							"},\n" + 
							 "[ " + migrations.join("\n,") + " ]\n" +  
							");\n";

				codegen+="var " + symbol2 + " = Backbone.Collection.extend({model:" + symbol1 + "});\n";
				codegen+=symbol2+".prototype.model = " + symbol1+";\n";
				codegen+=symbol2+".prototype.config = " + symbol1+".prototype.config;\n";
				appendSource(codegen);			
				// create the single model 
				state.parameters.push([symbol1,properCase(part)]);
				// create the collection
				state.parameters.push([symbol2,properCase(part)+'Collection']);
			}
		}
	}

	function parseView(viewName,state,dir,viewid)
	{
		var vd = dir ? path.join(dir,'views') : viewsDir;
		var sd = dir ? path.join(dir,'styles') : stylesDir;

		var viewFile = path.join(vd,viewName+".xml");
		if (!path.existsSync(viewFile))
		{
			return false;
		}

		var comment = "/**\n" + 
		              " * @view " + viewName + "\n" +
		              " */";
		appendSource("");
		appendSource(comment);

		var styleFile = path.join(sd,viewName+".json");
		var styles = loadStyle(styleFile);
		state.styles = styles;

		var xml = fs.readFileSync(viewFile);
		var doc = new DOMParser().parseFromString(String(xml));

		var id = viewid || doc.documentElement.getAttribute('id') || viewName;

		var parameters = state.parameters;
		var parentNode = state.parentNode;

		if (viewName=='index')
		{
			if (doc.documentElement.nodeName == 'SplitWindow')
			{
				//TODO -- this is not right yet - we need to populate masterView, detailView
				var src = "var $w = Ti.UI.iOS.createSplitWindow({\n" + 
						  "   masterView: ,\n" + 
						  "   detailView: ,\n" + 
						  "   id: '" + "'\n" + 
						  "});\n" + 
						  "$w.startLayout();\n";
				JS_EPILOG = src + JS_EPILOG;
			}
			else
			{
				appendSource("var $w = Ti.UI.createWindow();");
				appendSource("\n// defer rendering");
				appendSource("$w.startLayout();\n");
			}
			
			findAndLoadModels(state);
		}

		generateNode(false,viewFile,doc.documentElement,state,viewid||viewName);
		generateController(viewName,parameters,dir,state,id);

		return true;
	}

	var state = {
		parentNode:"$w",
		parameters:[["$w","window"]],
		models:[]
	};

	parseView('index',state);
	copyAssets();
	copyLibs();
	copyAlloy();
	generateSourceCode();
}

function createPlugin(rootDir)
{
	var plugins = path.join(rootDir,"plugins");
	ensureDir(plugins);
	
	var alloyPluginDir = path.join(plugins,"ti.alloy");
	ensureDir(alloyPluginDir);
	
	var alloyPlugin = path.join(alloyPluginDir,"plugin.py");
	var pi = path.join(__dirname,"template","plugin.py");
	
	copyFileSync(pi,alloyPlugin);
	logger.info('Deployed ti.alloy plugin to '+alloyPlugin);
}

function installPlugin(dir)
{
	createPlugin(dir);

	var tiapp = path.join(dir,'tiapp.xml');
	if (path.existsSync(tiapp))
	{
		var xml = fs.readFileSync(tiapp);
		var doc = new DOMParser().parseFromString(String(xml));
		var plugins = doc.documentElement.getElementsByTagName("plugins");
		var found = false;
		if (plugins.length > 0)
		{
			var items = plugins.item(0).getElementsByTagName('plugin');
			if (items.length > 0)
			{
				for (var c=0;c<items.length;c++)
				{
					var plugin = items.item(c);
					var name = getNodeText(plugin);
					if (name == 'ti.alloy')
					{
						found = true;
						break;
					}
				}
			}
		}
		
		if (!found)
		{
			var node = doc.createElement('plugin');
			node.setAttribute('version','1.0');
			var text = doc.createTextNode('ti.alloy');
			node.appendChild(text);
			
			var pna = null;
			
			// install the plugin into tiapp.xml
			if (plugins.length == 0)
			{
				var pn = doc.createElement('plugins');
				doc.documentElement.appendChild(pn);
				doc.documentElement.appendChild(doc.createTextNode("\n"));
				pna = pn;
			}
			else
			{
				pna = plugins.item(0);
			}
			
			pna.appendChild(node);
			pna.appendChild(doc.createTextNode("\n"));
			
			var serializer = new XMLSerializer();
			var newxml = serializer.serializeToString(doc);
			
			fs.writeFileSync(tiapp,newxml);
			logger.info("Installed 'ti.alloy' plugin to "+tiapp);
		}
	}
}

function newproject(args)
{
	if (args.length == 0)
	{
		die("newproject requires the [OUTPUT_DIR] as a second argument");
	}
	var outputPath = path.join(args[0],'app');
	if (path.existsSync(outputPath))
	{
		if (!program.force)
		{
			die("Directory already exists at: "+outputPath);
		}
	}
	if (!path.existsSync(path.join(args[0]))) fs.mkdirSync(path.join(args[0]));
	if (!path.existsSync(outputPath)) fs.mkdirSync(outputPath);
	
	var dirs = ['controllers','styles','views','models','migrations','config','assets','lib','vendor'];
	for (var c=0;c<dirs.length;c++)
	{
		var p = path.join(outputPath,dirs[c]);
		if (!path.existsSync(p))
		{
			fs.mkdirSync(p);
		}
	}
	
	var INDEX_XML  = "<?xml version='1.0'?>\n" +
					 "<View class='container'>\n" +
					 '  <Label id="t">Hello, World</Label>\n' +
					 "</View>\n",
		INDEX_JSON = "{\n" +
					 '   ".container":\n' +
					 '   {\n' +
					 '       "backgroundColor":"white"\n' +
					 '   },\n' +
		             '   "Label":\n' +
		             '    {\n' +
		             '       "width": Ti.UI.FIT,\n'+ 
		             '       "height": Ti.UI.FIT\n'+ 
		             '    }\n' + 
		             "}\n",
		INDEX_C    = "t.addEventListener('click',function(){\n" + 
					 "   alert(t.text);\n" +
					 "});\n";
	
	fs.writeFileSync(path.join(outputPath,'views','index.xml'),INDEX_XML);
	fs.writeFileSync(path.join(outputPath,'styles','index.json'),INDEX_JSON);
	fs.writeFileSync(path.join(outputPath,'controllers','index.js'),INDEX_C);
	
	installPlugin(args[0]);
	
	logger.info('Generated new project at: '+outputPath);
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

function generateController(home,args)
{
	if (args.length == 0)
	{
		die("generate controller requires a NAME as third argument");
	}
	var name = args[0];
	
	var cn = path.join(home,'controllers',name+'.js');
	if (path.existsSync(cn) && !program.force)
	{
		die("File already exists: "+cn);
	}
	
	// right now, it's empty.  we'll likely want to generate a skeleton
	var	C    = "\n";
	fs.writeFileSync(cn,C);

	logger.info('Generate controller named '+name);
}

function generateView(home,args)
{
	if (args.length == 0)
	{
		die("generate view requires a NAME as third argument");
	}
	var name = args[0];
	
	var vn = path.join(home,'views',name+'.xml');
	if (path.existsSync(vn) && !program.force)
	{
		die("File already exists: "+vn);
	}
	var sn = path.join(home,'styles',name+'.xml');
	if (path.existsSync(sn) && !program.force)
	{
		die("File already exists: "+sn);
	}
	
	// right now, it's empty.  we'll likely want to generate a skeleton
	var XML  = "<?xml version='1.0'?>\n" +
			   "<View class='container'>\n" +
			   '\n' +
			   "</View>\n",
		JSON = "{\n" +
				 '   ".container":\n' +
				 '   {\n' +
				 '       "backgroundColor":"white"\n'+
				 '   },\n'
		       "}\n";

	fs.writeFileSync(vn,XML);
	fs.writeFileSync(sn,JSON);

	logger.info('Generate view and styles named '+name);
}

function pad(x)
{
	if (x < 10)
	{
		return '0' + x;
	}
	return x;
}

function generateMigrationFileName(t)
{
	var d = new Date;
	var s = String(d.getUTCFullYear()) + String(pad(d.getUTCMonth())) + String(pad(d.getUTCDate())) + String(pad(d.getUTCHours())) + String(pad(d.getUTCMinutes())) + String(d.getUTCMilliseconds())
	return s + '_' + t + '.js';
}

function generateModel(home,args)
{
	if (args.length == 0)
	{
		die("generate controller requires a NAME as third argument");
	}
	var name = args[0],
		a = args.slice(1);

	var migrationsDir = path.join(home,'migrations');
	ensureDir(migrationsDir);
		
	if (a.length == 0)
	{
		die("missing model columns as fourth argument and beyond");
	}
	
	var J = {"columns":{},"defaults":{},"adapter":{"type":"sql","tablename":name}};
	for (var c=0;c<a.length;c++)
	{
		var X = a[c].split(":");
		J.columns[X[0]] = X[1];
	}
	
	var mn = path.join(home,'models',name+'.json');
	if (path.existsSync(mn) && !program.force)
	{
		die("File already exists: "+mn);
	}
	
	//TODO: automatically generate migration file

	var ast = jsp.parse("("+JSON.stringify(J)+")"); // parse code and get the initial AST
	ast = pro.ast_mangle(ast); // get a new AST with mangled names
	ast = pro.ast_squeeze(ast); // get an AST with compression optimizations
	var final_code = pro.gen_code(ast,{beautify:true,quote_keys:true}); 
	final_code = final_code.substring(1,final_code.length-2); // remove ( ) needed for parsing

	fs.writeFileSync(mn,final_code);
	
	var mf = path.join( migrationsDir, generateMigrationFileName(name) );
	
	var mc = final_code.split("\n");
	
	var md = "" +
	'migration.up = function(db)\n'+
	'{\n'+
	'   db.createTable("' + name + '",\n';
	
	_.each(mc,function(l){
		md+='      '+l+'\n';
	});
	
	md+=''+
	'   );\n' +
	'};\n'+
	'\n'+
	'migration.down = function(db)\n'+
	'{\n'+
	'   db.dropTable("' + name + '");\n'+
	'};\n'+
	'\n';

	fs.writeFileSync(mf,md);

	logger.info('Generate model named '+name);
}

function generateMigration(home,args)
{
	if (args.length == 0)
	{
		die("generate migration requires a NAME as third argument");
	}
	
	var name = args[0];
	var migrationsDir = path.join(home,'migrations');
	ensureDir(migrationsDir);
	
	var mf = path.join( migrationsDir, generateMigrationFileName(name) );

	var md = "" +
	'migration.up = function(db)\n'+
	'{\n'+
	'};\n'+
	'\n'+
	'migration.down = function(db)\n'+
	'{\n'+
	'};\n'+
	'\n';

	fs.writeFileSync(mf,md);
}

function generate(args)
{
	if (args.length == 0)
	{
		die("generate requires a TYPE such as 'controller' as second argument");
	}
	var home = resolveAppHome();
	var newargs = args.slice(1);
	switch(args[0])
	{
		case 'controller':
		{
			generateController(home,newargs);
			break;
		}
		case 'view':
		{
			generateView(home,newargs);
			break;
		}
		case 'model':
		{
			generateModel(home,newargs);
			break;
		}
		case 'migration':
		{
			generateMigration(home,newargs);
			break;
		}
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
			newproject(newargs);
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
		default:
		{
			die('Unknown action: '+action.red);
		}
	}
	
}

main(program.args);
