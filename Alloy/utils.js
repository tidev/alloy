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
	}
};

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

exports.getWidgetDirectories = function(outputPath) {
	var dirs = [];
	var widgetPath = path.join(outputPath,'app','widgets');
	if (path.existsSync(widgetPath)) {
		var wFiles = fs.readdirSync(widgetPath);
		for (var i = 0; i < wFiles.length; i++) {
			var wDir = path.join(widgetPath,wFiles[i]); 
			if (fs.statSync(wDir).isDirectory() &&
				_.indexOf(fs.readdirSync(wDir), 'widget.json') !== -1) {
				dirs.push({
					dir: wDir,
					manifest: JSON.parse(fs.readFileSync(path.join(wDir,'widget.json'),'utf8'))
				});
			} 
		}
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



