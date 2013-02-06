// The island of misfit toys... for functions

var path = require('path'),
	fs = require('fs'),
	colors = require('colors'),
	wrench = require('wrench'),
	jsonlint = require('jsonlint'),
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
		if (!node) { return ''; }
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
	parseFromString: function(string) {
		// TODO: https://jira.appcelerator.org/browse/ALOY-267
		// var warn = console.warn;
		// console.warn = function(msg) {
		// 	exports.die(['Error parsing XML document', msg]);
		// };

		// TODO: https://jira.appcelerator.org/browse/ALOY-309
		try {
			var errorHandler = {};
			errorHandler.error = errorHandler.fatalError = function(m) { 
				exports.die(['Error parsing XML file.'].concat((m || '').split(/[\r\n]/))); 
			};
			errorHandler.warn = errorHandler.warning = function(m) {
				logger.warn((m || '').split(/[\r\n]/));
			};
			var doc = new DOMParser({errorHandler:errorHandler,locator:{}}).parseFromString(string);
		} catch (e) {
			exports.die('Error parsing XML file.', e);
		}
		//console.warn = warn;

		return doc;
	},
	parseFromFile: function(filename) {
		var xml = fs.readFileSync(filename,'utf8');
		return exports.XML.parseFromString(xml);
	},
	createEmptyNode: function(name, ns) {
		var str = '<' + name + (ns ? ' ns="' + ns + '"' : '') + '></' + name + '>';
		return exports.XML.parseFromString(str).documentElement;
	},
	getAlloyFromFile: function(filename) {
		var doc = exports.XML.parseFromFile(filename);
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
	toString: function(node) {
		return (new XMLSerializer()).serializeToString(node);
	}
};

exports.tiapp = {
	parse: function(dir) {
		dir || (dir = './');
		var tiappPath = path.join(dir,'tiapp.xml');
		if (!path.existsSync(tiappPath)) {
			U.die('tiapp.xml file does not exist at "' + tiappPath + '"');
		}
		return exports.XML.parseFromFile(tiappPath);
	},
	getTitaniumSdkVersion: function(doc) {
		var elems = doc.documentElement.getElementsByTagName('sdk-version');
		return elems && elems.length > 0 ? exports.XML.getNodeText(elems.item(elems.length-1)) : null;
	},
	getProperty: function(doc, name) {
		var props = doc.documentElement.getElementsByTagName('property');
		for (var i = 0; i < props.length; i++) {
			if (props.item(i).getAttribute('name') === name) {
				return props.item(i);
			}
		}
		return null;
	},	
	upStackSizeForRhino: function(dir) {
		var doc = exports.tiapp.parse(dir);
		var runtime = exports.XML.getNodeText(exports.tiapp.getProperty(doc, 'ti.android.runtime'));

		if (runtime === 'rhino') {
			var stackSize = exports.tiapp.getProperty(doc, 'ti.android.threadstacksize');
			if (stackSize !== null) {
				if (parseInt(stackSize.nodeValue) < 32768) {
					stackSize.nodeValue('32768');
				}
			} else {
				var node = doc.createElement('property');
				var text = doc.createTextNode('32768');
				node.setAttribute('name','ti.android.threadstacksize');
				node.setAttribute('type','int');
				node.appendChild(text);

				doc.documentElement.appendChild(node);
			}

			// serialize the xml and write to tiapp.xml
			var serializer = new XMLSerializer();
			var newxml = serializer.serializeToString(doc);
			fs.writeFileSync(path.join(dir,'tiapp.xml'),newxml,'utf8');
		}
	},
	install: function(type, dir, opts) {
		type || (type = 'module');
		dir || (dir = './');
		opts || (opts = {});

		var err = 'Project creation failed. Unable to install ' + type + ' "' + (opts.name || opts.id) + '"';
		var tiappPath = path.join(dir,'tiapp.xml');
		if (!path.existsSync(tiappPath)) {
			U.die([ 'tiapp.xml file does not exist at "' + tiappPath + '"', err ]);
		}

		// read the tiapp.xml file
		var doc = exports.XML.parseFromFile(tiappPath);
		var collection = doc.documentElement.getElementsByTagName(type + 's');
		var found = false;

		// Determine if the module or plugin is already installed
		if (collection.length > 0) {
			var items = collection.item(0).getElementsByTagName(type);
			if (items.length > 0) {
				for (var c = 0; c < items.length; c++) {
					var theItem = items.item(c);
					var theItemText = exports.XML.getNodeText(theItem);

					// TODO: https://jira.appcelerator.org/browse/ALOY-188
					if (theItemText == opts.id) {
						found = true;
						break;
					}
				}
			}
		}

		// install module or plugin
		if (!found) {
			// create the node to be inserted
			var node = doc.createElement(type);
			var text = doc.createTextNode(opts.id);
			if (opts.platform) { 
				node.setAttribute('platform',opts.platform); 
			}
			if (opts.version) { 
				node.setAttribute('version',opts.version);
			}
			node.appendChild(text);

			// add the node into tiapp.xml
			var pna = null;
			if (collection.length === 0) {
				var pn = doc.createElement(type + 's');
				doc.documentElement.appendChild(pn);
				doc.documentElement.appendChild(doc.createTextNode("\n"));
				pna = pn;
			} else {
				pna = collection.item(0);
			}
			pna.appendChild(node);
			pna.appendChild(doc.createTextNode("\n"));
			
			// serialize the xml and write to tiapp.xml
			var serializer = new XMLSerializer();
			var newxml = serializer.serializeToString(doc);
			fs.writeFileSync(tiappPath,newxml,'utf8');

			logger.info('Installed "' + opts.id + '" ' + type + ' to ' + tiappPath);
		}

	},
	installModule: function(dir, opts) {
		this.install('module', dir, opts);
	},
	installPlugin: function(dir, opts) {
		this.install('plugin', dir, opts);
	}
};

exports.getAndValidateProjectPaths = function(argPath) {
	var projectPath = path.resolve(argPath);

	// See if we got the "app" path or the project path as an argument
	projectPath = path.existsSync(path.join(projectPath,'..','tiapp.xml')) ? path.join(projectPath,'..') : projectPath;

	// Assign paths objects
	var paths = {
		project: projectPath,
		app: path.join(projectPath,'app'),
		indexBase: path.join(CONST.DIR.VIEW,CONST.NAME_DEFAULT + '.' + CONST.FILE_EXT.VIEW)
	};
	paths.index = path.join(paths.app,paths.indexBase);
	paths.assets = path.join(paths.app,'assets');
	paths.resources = path.join(paths.project,'Resources');
	paths.resourcesAlloy = path.join(paths.resources,'alloy');

	// validate project and "app" paths
	if (!path.existsSync(paths.project)) {
		exports.die('Titanium project path does not exist at "' + paths.project + '".');
	} else if (!path.existsSync(path.join(paths.project,'tiapp.xml'))) {
		exports.die('Invalid Titanium project path (no tiapp.xml) at "' + paths.project + '"');
	} else if (!path.existsSync(paths.app)) {
		exports.die('Alloy "app" directory does not exist at "' + paths.app + '"');
	} else if (!path.existsSync(paths.index)) {
		exports.die('Alloy "app" directory has no "' + paths.indexBase + '" file at "' + paths.index + '".');
	}

	return paths;
}

exports.createErrorOutput = function(msg, e) {
	var errs = [msg || 'An unknown error occurred'];
	var posArray = [];

	if (e) {
		var line = e.line || e.lineNumber;
		if (e.message) { errs.push(e.message.split('\n')) }
		if (line)  { posArray.push('line ' + line) }
		if (e.col) { posArray.push('column ' + e.col) }
		if (e.pos) { posArray.push('position ' + e.pos) }
		if (posArray.length) { errs.push(posArray.join(', ')) }

		// add the stack trace if we don't get anything good
		if (errs.length < 2) { errs.unshift(e.stack) }
	} else {
		errs.unshift(e.stack);
	}
	
	return errs;
}

exports.deleteOrphanFiles = function(targetDir, srcDirs, exceptions) {
	var nodeAcsRegex = /^ti\.cloud\..+?\.js$/;

	// skip if target or source is not defined
	if (!fs.existsSync(targetDir) || !srcDirs) {
		return;
	}
	!_.isArray(srcDirs) && (srcDirs = [srcDirs]);

	// check all target files
	_.each(wrench.readdirSyncRecursive(targetDir), function(file) {
		// skip the app.js and node acs files
		if (file === 'app.js' || nodeAcsRegex.test(file)) { return; }
		if (_.contains(exceptions, file)) { return; }

		// see if this target exists in any of the src dirs
		var found = false;
		for (var i = 0; i < srcDirs.length; i++) {
			var srcDir = srcDirs[i];
			var src = path.join(srcDir,file);
			if (fs.existsSync(src)) {
				found = true;
				break;
			}
		}

		if (!found) {
			var target = path.join(targetDir,file);

			// already deleted, perhaps a file in a deleted directory
			if (!fs.existsSync(target)) { return; }

			// delete the file/directory
			var targetStat = fs.statSync(target);
			if (targetStat.isDirectory()) {
				logger.trace('Deleting orphan directory ' + target.yellow);
				wrench.rmdirSyncRecursive(target,true);
			} else {
				logger.trace('Deleting orphan file ' + target.yellow);
				fs.unlinkSync(target);
			}
		}
	});
}

exports.updateFiles = function(srcDir, dstDir) {
	if (!fs.existsSync(srcDir)) {
		return;
	}
	if (!fs.existsSync(dstDir)) {
		wrench.mkdirSyncRecursive(dstDir, 0777);
	}

	_.each(wrench.readdirSyncRecursive(srcDir), function(file) {
		var src = path.join(srcDir,file);
		var dst = path.join(dstDir,file);
		var srcStat = fs.statSync(src);

		if (fs.existsSync(dst)) {
			var dstStat = fs.statSync(dst);

			if (!dstStat.isDirectory()) {
				// copy file in if it is a JS file or if its mtime is 
				// greater than the one in Resources
				if (path.extname(src) === '.js' ||
					srcStat.mtime.getTime() > dstStat.mtime.getTime()) {
					logger.debug('Copying ' + src.yellow + ' to ' + dst.yellow);
					exports.copyFileSync(src,dst);
				}
			}
		} else {
			if (srcStat.isDirectory()) {
				logger.debug('Creating directory ' + dst.yellow);
				wrench.mkdirSyncRecursive(dst,0777);
			} else {
				logger.debug('Copying ' + src.yellow + ' to ' + dst.yellow);
				exports.copyFileSync(src,dst);
			}
		}	
	});
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
		try {
			var content = fs.readFileSync(configPath,'utf8');
			appWidgets = jsonlint.parse(content).dependencies;
		} catch (e) {
			exports.die('Error parsing "config.json"', e);
		}
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

					try {
						var manifest = jsonlint.parse(fs.readFileSync(path.join(wDir,'widget.json'),'utf8'));
					} catch (e) {
						exports.die('Error parsing "widget.json" for "' + path.basename(wDir) + '"', e);
					}
                    
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

exports.ucfirst = function (text) {
    if (!text)
        return text;
    return text[0].toUpperCase() + text.substr(1);
};

exports.lcfirst = function (text) {
    if (!text)
        return text;
    return text[0].toLowerCase() + text.substr(1);
};

exports.trim = function(line) {
	return String(line).replace(/^\s\s*/, '').replace(/\s\s*$/, '');
}

exports.rmdirContents = function(dir, exceptions) {
	try {
		var files = fs.readdirSync(dir);
	} catch (e) {
		return;
	}

	for (var i = 0, l = files.length; i < l; i++) {
		var currFile = path.join(dir,files[i]);
		var stat = fs.lstatSync(currFile);

		// process the exceptions
		var result = _.find(exceptions, function(exception) {
			if (exception instanceof RegExp) {
				return exception.test(files[i]);
			} else {
				return files[i] === exception;
			}
		});

		// skip any exceptions
		if (result) {
			continue;
		// use wrench to delete directories
		} else if (stat.isDirectory()) {
			wrench.rmdirSyncRecursive(currFile, true);
		// unlink any files or links
		} else {
			fs.unlinkSync(currFile);
		}
	}
}

exports.resolveAppHome = function() {
	var indexView = path.join(CONST.DIR.VIEW,CONST.NAME_DEFAULT + '.' + CONST.FILE_EXT.VIEW);
	var paths = [ path.join('.','app'), path.join('.') ];

	// Do we have an Alloy project? Find views/index.xml.
	for (var i = 0; i < paths.length; i++) {
		paths[i] = path.resolve(paths[i]);
		var testPath = path.join(paths[i],indexView);
		if (path.existsSync(testPath)) {
			return paths[i];
		}
	}

	// Report error, show the paths searched.
	var errs = [ 'No valid Alloy project found at the following paths (no "views/index.xml"):' ];
	errs.push(paths);
	exports.die(errs);
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

exports.ensureDir = function(p) {
	if (!path.existsSync(p)) {
		//logger.debug("Creating directory: "+p);
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
		try {
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
		catch (e) {
			logger.warn('Could not copy ' + fpath);
		}
	}
}

exports.isTiProject = function(dir) 
{
	return (path.existsSync(path.join(dir,'tiapp.xml')));
}

exports.prettyPrintJson = function(j) {
	var ast = jsp.parse("("+JSON.stringify(j)+")");
	ast = pro.ast_mangle(ast);
	var final_code = pro.gen_code(ast,{beautify:true,quote_keys:true}); 
	return final_code = final_code.substring(1,final_code.length-2);
}

exports.die = function(msg, e) {
	if (e) {
		logger.error(exports.createErrorOutput(msg, e));
	} else {
		logger.error(msg);
	}
	process.exit(1);
}

exports.dieWithNode = function(node, msg) {
	msg = _.isArray(msg) ? msg : [msg];
	msg.unshift('Error with <' + node.nodeName + '> at line ' + node.lineNumber);
	exports.die(msg);
}

exports.installPlugin = function(alloyPath, projectPath) {
	var id = 'ti.alloy';
	var plugins = {
		plugin: {
			file: CONST.PLUGIN_FILE,
			src: path.join(alloyPath,'Alloy','plugin'),
			dest: path.join(projectPath,'plugins',id)
		},
		hook: {
			file: CONST.HOOK_FILE,
			src: path.join(alloyPath,'hooks'),
			dest: path.join(projectPath,'plugins',id,'hooks')
		}
	};

	_.each(plugins, function(o, type) {
		var srcFile = path.join(o.src,o.file);
		var destFile = path.join(o.dest,o.file);

		// skip if the src and dest are the same file
		if (path.existsSync(destFile) &&
			fs.readFileSync(srcFile,'utf8') === fs.readFileSync(destFile,'utf8')) {
			return;
		}
		exports.ensureDir(o.dest);
		exports.copyFileSync(srcFile, destFile);

		logger.info('Deployed ti.alloy ' + type + ' to ' + destFile);
	});

	// add the plugin to tiapp.xml, if necessary
	exports.tiapp.installPlugin(projectPath, {
		id: 'ti.alloy',
		version: '1.0'
	});
}



