// The island of misfit toys... for functions

var path = require('path'),
	fs = require('fs'),
	colors = require('colors'),
	wrench = require('wrench'),
	logger = require('./common/logger'),
	XMLSerializer = require("xmldom").XMLSerializer,
	DOMParser = require("xmldom").DOMParser,
	jsp = require("./uglify-js/uglify-js").parser,
	pro = require("./uglify-js/uglify-js").uglify,
	_ = require("./lib/alloy/underscore")._,
	CONST = require('./common/constants')
;

exports.XML = {
	getNodeText: function(node) {
		var serializer = new XMLSerializer(),
			str = '';
		for (var c = 0; c < node.childNodes.length; c++) {
			if (node.childNodes[c].nodeType != 1) {
				str += serializer.serializeToString(node.childNodes[c]);
			}
		}
		return str;
	},
	getElementsFromNodes: function(nodeList) {
		var elems = [];
		if (nodeList && nodeList.length) {
			for (var i = 0, l = nodeList.length; i < l; i++) {
				var node = nodeList.item(i);
				if (node.nodeType === 1) {
					elems.push(node);
				}
			}
		}
		return elems;
	},
	createEmptyNode: function(name, ns) {
		var str = '<' + name + (ns ? ' ns="' + ns + '"' : '') + '></' + name + '>';
		return new DOMParser().parseFromString(str).documentElement;
	},
	getDocRootFromFile: function(filename) {
		// read and parse the view file
		var xml = fs.readFileSync(filename,'utf8');
		var doc = new DOMParser().parseFromString(xml);
		var docRoot = doc.documentElement;

		// Make sure the markup has a top-level <Alloy> tag
		if (docRoot.nodeName !== CONST.ROOT_NODE) {
			exports.die([
				'Invalid view file "' + filename + '".',
				'All view markup must have a top-level <Alloy> tag'
			]);
		}

		return docRoot;
	},
	assembleAlloyXml: function(filename) {

	}
};

exports.installModule = function(dir, opts)
{
	var tiapp = path.join(dir,'tiapp.xml');
	if (path.existsSync(tiapp))
	{
		var xml = fs.readFileSync(tiapp);
		var doc = new DOMParser().parseFromString(String(xml));
		var modules = doc.documentElement.getElementsByTagName("modules");
		var found = false;

		if (modules.length > 0)
		{
			var items = modules.item(0).getElementsByTagName('module');
			if (items.length > 0)
			{
				for (var c=0;c<items.length;c++)
				{
					var mod = items.item(c);
					var name = exports.XML.getNodeText(mod);

					// TODO: https://jira.appcelerator.org/browse/ALOY-188
					if (name.toLowerCase() == opts.id.toLowerCase())
					{
						found = true;
						break;
					}
				}
			}
		}
		
		if (!found)
		{
			var node = doc.createElement('module');
			if (opts.platform) {
				node.setAttribute('platform',opts.platform);
			}
			node.setAttribute('version',opts.version || '1.0');

			// TODO: https://jira.appcelerator.org/browse/ALOY-188
			var text = doc.createTextNode(opts.id.toLowerCase());
			node.appendChild(text);
			
			var pna = null;
			
			// install the plugin into tiapp.xml
			if (modules.length == 0)
			{
				var pn = doc.createElement('modules');
				doc.documentElement.appendChild(pn);
				doc.documentElement.appendChild(doc.createTextNode("\n"));
				pna = pn;
			}
			else
			{
				pna = modules.item(0);
			}
			
			pna.appendChild(node);
			pna.appendChild(doc.createTextNode("\n"));
			
			var serializer = new XMLSerializer();
			var newxml = serializer.serializeToString(doc);
			
			fs.writeFileSync(tiapp,newxml,'utf-8');
			logger.info("Installed '" + opts.id + "' module to "+tiapp);
		}
	}
}

exports.copyAlloyDir = function(appDir, sources, destDir) {
	var sources = _.isArray(sources) ? sources : [sources];
	_.each(sources, function(source) {
		var sourceDir = path.join(appDir, source);
		if (path.existsSync(sourceDir)) {
			logger.info('Copying ' + source + ' from: ' + sourceDir.yellow);
			if (!path.existsSync(destDir)) {
				wrench.mkdirSyncRecursive(destDir, 0777);
			}
			exports.copyFilesAndDirs(sourceDir, destDir);
		}
	});
};

exports.getWidgetDirectories = function(outputPath, appDir) {
	var configPath = path.join(appDir, 'config.json');
	var appWidgets = [];
	if (path.existsSync(configPath)) {
		var content = fs.readFileSync(configPath).toString();
		appWidgets = JSON.parse(content).widgets;
	}

	var dirs = [];
	var collections = [];
	var widgetPaths = [];
	widgetPaths.push(path.join(__dirname,'..','widgets'));
	widgetPaths.push(path.join(outputPath,'app','widgets'));

	_.each(widgetPaths, function(widgetPath) {
		if (path.existsSync(widgetPath)) {
			var wFiles = fs.readdirSync(widgetPath);
			for (var i = 0; i < wFiles.length; i++) {
				var wDir = path.join(widgetPath,wFiles[i]); 
				if (fs.statSync(wDir).isDirectory() &&
					_.indexOf(fs.readdirSync(wDir), 'widget.json') !== -1) {

                    var manifest = JSON.parse(fs.readFileSync(path.join(wDir,'widget.json'),'utf8'));
					collections[manifest.id] = {
						dir: wDir,
						manifest: manifest
					};
				} 
			}
		}
	});

	function walkWidgetDependencies(collection) {  
		if (collection == null)
			return;  

        dirs.push(collection);
		for (var dependency in collection.manifest.dependencies) { 
			walkWidgetDependencies(collections[dependency]);
		}
	}  

    for (var id in appWidgets) {
    	walkWidgetDependencies(collections[id]); 
    }
	
	return dirs;
};

exports.properCase = function(n) {
	return n.charAt(0).toUpperCase() + n.substring(1);
};

exports.lcfirst = function (text) {
    if (!text)
        return text;
    return text[0].toLowerCase() + text.substr(1);
};

exports.trim = function(line) {
	return String(line).replace(/^\s\s*/, '').replace(/\s\s*$/, '');
}

exports.resolveAppHome = function() {
	var f = path.join("./","app");
	if (path.existsSync(f))
	{
		return f;
	}
	var cf = path.join('./', 'alloy.jmk');
	if (path.existsSync(cf))
	{
		return path.resolve(path.join('.'));
	}
	exports.die("This directory: "+path.resolve(f)+" does not look like an Alloy directory");
}



exports.copyFileSync = function(srcFile, destFile) 
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

exports.ensureDir = function(p)
{
	if (!path.existsSync(p))
	{
		logger.debug("Creating directory: "+p);
		wrench.mkdirSyncRecursive(p, 0777);
	}
}

exports.copyFilesAndDirs = function(f,d)
{
	var files = fs.readdirSync(f);
	for (var c=0;c<files.length;c++)
	{
		var file = files[c];
		var fpath = path.join(f,file);
		var stats = fs.lstatSync(fpath);
		var rd = path.join(d,file);
		logger.debug('Copying ' + fpath.yellow + ' to '.cyan + d.yellow);
		if (stats.isDirectory())
		{
			exports.ensureDir(rd);
			wrench.copyDirSyncRecursive(fpath, rd, {preserve:true});
		}
		else
		{
			exports.copyFileSync(fpath,rd);
		}
	}
}

exports.isTiProject = function(dir) 
{
	return (path.existsSync(path.join(dir,'tiapp.xml')));
}

exports.stringifyJSON = function(j)
{
	var ast = jsp.parse("("+JSON.stringify(j)+")");
	ast = pro.ast_mangle(ast);
	var final_code = pro.gen_code(ast,{beautify:true,quote_keys:true}); 
	return final_code = final_code.substring(1,final_code.length-2); // remove ( ) needed for parsing
}

exports.die = function(msg) 
{
	logger.error(msg);
	process.exit(1);
}



