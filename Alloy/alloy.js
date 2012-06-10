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
	DOMParser = require("xmldom").DOMParser,
	XMLSerializer = require("xmldom").XMLSerializer;
		
program
	.version('0.0.1')
	.description('Generate Titanium project code based on a declarative UI')
	.usage('INPUT_PATH [OPTIONS]')
	.option('-i, --installFolder', 'Print the install location of this module')
	.option('-o, --outputPath <outputPath>', 'Output path for generated code. (Default: ./output)')
	.option('-l, --logLevel <logLevel>', 'Log level (default: 3 [DEBUG])')
	.parse(process.argv);

var outputPath,
	
	JS = "/**\n"+
	     " * Alloy for Titanium by Appcelerator\n" +
	     " * This is generated code, DO NOT MODIFY - change will be lost!\n"+
	     " * Copyright (c) 2012 by Appcelerator, Inc.\n"+
	     " */\n" + 
	     "\n"+
		 "var Alloy = require('alloy'),\n" + 
		 "        $ = Alloy.$,\n" +
		 "        _ = Alloy._;\n" +
		 "\n",
	
	JS_EPILOG = "$w.finishLayout();\n$w.open();\n",
	id = 1,
	ids = {};
	
function generateId()
{
	return id++;
}

function generateVarName()
{
	return '$'+generateId();
}

var die = function(msg, printUsage) {
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
		logger.info("Creating directory: "+p);
		fs.mkdirSync(p);
	}
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
		return JSON.parse(f);
	}
	return {};
}

function main(args)
{
	var inputPath = args[0];
	
	if (!path.existsSync(inputPath)) 
	{
		die('inputPath "' + inputPath + '" does not exist');
	}	
	
	outputPath = program.outputPath || './output';
	ensureDir(outputPath);
	
	var viewsDir = path.join(inputPath,'views');
	if (!path.existsSync(viewsDir))
	{
		die("Couldn't find expected views directory at '"+viewsDir+"'");
	}
	var stylesDir = path.join(inputPath,'styles');
	var controllersDir = path.join(inputPath,'controllers');
	var widgetsDir = path.join(inputPath,'widgets');
	
	var indexView = path.join(viewsDir,"index.xml");
	if (!path.existsSync(indexView))
	{
		die("Couldn't find expected index view at '"+indexView+"'");
	}
	var resourcesDir = path.join(outputPath,"Resources");
	ensureDir(resourcesDir);
	
	function generateSourceCode()
	{
		var appJS = path.join(resourcesDir,"app.js");
		var code = JS + "\n" + JS_EPILOG;
		fs.writeFileSync(appJS,code);
		
		console.log(code);
	}
	
	function copyAssets()
	{
		var assets = path.join(inputPath,'assets');
		if (path.existsSync(assets))
		{
			logger.info('Copying assets from: '+assets);
			wrench.copyDirSyncRecursive(assets,resourcesDir);
		}
	}
	
	function copyLibs()
	{
		var lib = path.join(inputPath,'lib');
		if (path.existsSync(lib))
		{
			logger.info('Copying app libs: '+lib);
			wrench.copyDirSyncRecursive(lib,resourcesDir);
		}
		var vendor = path.join(inputPath,'vendor');
		if (path.existsSync(vendor))
		{
			logger.info('Copying vendor libs: '+vendor);
			wrench.copyDirSyncRecursive(vendor,path.join(resourcesDir,'vendor'));
		}
	}
	
	function copyAlloy()
	{
		var lib = path.join(__dirname,'lib');
		wrench.copyDirSyncRecursive(lib,resourcesDir);
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
		
		// special TEXT processing for label
		if (nodename == 'Label' && node.childNodes.length > 0)
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
			state.styles['#'+id]['text']=str;
		}
		
		appendSource("var " + symbol + " = " + ns + "." + fn + "({");
		appendSource(generateStyleParams(state.styles,classes,id,node.nodeName));
		appendSource("});");
		appendSource(state.parentNode+".add("+symbol+");");
		
		var childstate = {
			parentNode: symbol,
			parameters: state.parameters,
			styles: state.styles
		};
		
		if (id && state.parentNode!=symbol) state.parameters.push([symbol,id]);

		for (var c=0;c<node.childNodes.length;c++)
		{
			var child = node.childNodes[c];
			generateNode(true,viewFile,child,childstate);
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
		}

		generateNode(false,viewFile,doc.documentElement,state,viewid||viewName);
		generateController(viewName,parameters,dir,state,id);
		
		return true;
	}
	
	var state = {
		parentNode:"$w",
		parameters:[["$w","window"]]
	};
	
	parseView('index',state);
	copyAssets();
	copyLibs();
	copyAlloy();
	generateSourceCode();
}

main(program.args);
