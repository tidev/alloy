// The island of misfit toys... for functions

var path = require('path'),
	fs = require('fs'),
	colors = require('colors'),
	crypto = require('crypto'),
	util = require('util'),
	wrench = require('wrench'),
	jsonlint = require('jsonlint'),
	logger = require('./logger'),
	tiapp = require('./tiapp'),
	XMLSerializer = require("xmldom").XMLSerializer,
	DOMParser = require("xmldom").DOMParser,
	_ = require("./lib/alloy/underscore")._,
	CONST = require('./common/constants'),
	sourceMapper = require('./commands/compile/sourceMapper');

var NODE_ACS_REGEX = /^ti\.cloud\..+?\.js$/;

exports.XML = {
	getNodeText: function(node) {
		if (!node) { return ''; }
		var serializer = new XMLSerializer(),
			str = '';
		for (var c = 0; c < node.childNodes.length; c++) {
			if (node.childNodes[c].nodeType === 3) {
				str += serializer.serializeToString(node.childNodes[c]);
			}
		}
		return str.replace(/\&amp;/g,'&');
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
		var doc;
		try {
			var errorHandler = {};
			errorHandler.error = errorHandler.fatalError = function(m) {
				exports.die(['Error parsing XML file.'].concat((m || '').split(/[\r\n]/)));
			};
			errorHandler.warn = errorHandler.warning = function(m) {
				// ALOY-840: die on unclosed XML tags
				// xmldom hardcodes this as a warning with the string message 'unclosed xml attribute'
				// even when it's a tag that's unclosed
				if(m.indexOf('unclosed xml attribute') === -1) {
					logger.warn((m || '').split(/[\r\n]/));
				} else {
					m = m.replace('unclosed xml attribute', 'Unclosed XML tag or attribute');
					exports.die(['Error parsing XML file.'].concat((m || '').split(/[\r\n]/)));
				}
			};
			doc = new DOMParser({errorHandler:errorHandler,locator:{}}).parseFromString(string);
		} catch (e) {
			exports.die('Error parsing XML file.', e);
		}

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
	},
	previousSiblingElement: function(node) {
		if (!node || !node.previousSibling || node.previousSibling === null) {
			return null;
		} else if (node.previousSibling.nodeType === 1) {
			return node.previousSibling;
		} else {
			return exports.XML.previousSiblingElement(node.previousSibling);
		}
	}
};

exports.readTemplate = function(name) {
	return fs.readFileSync(path.join(__dirname,'template',name),'utf8');
};

exports.evaluateTemplate = function(name, o) {
	return _.template(exports.readTemplate(name), o);
};

exports.getAndValidateProjectPaths = function(argPath, opts) {
	var projectPath = path.resolve(argPath),
		opts = opts || {};

	// See if we got the "app" path or the project path as an argument
	projectPath = fs.existsSync(path.join(projectPath,'..','tiapp.xml')) ?
		path.join(projectPath,'..') : projectPath;

	// Assign paths objects
	var paths = {
		project: projectPath,
		app: path.join(projectPath,'app'),
		indexBase: path.join(CONST.DIR.CONTROLLER,CONST.NAME_DEFAULT + '.' + CONST.FILE_EXT.CONTROLLER)
	};
	paths.index = path.join(paths.app,paths.indexBase);
	paths.assets = path.join(paths.app,'assets');
	paths.resources = path.join(paths.project,'Resources');
	paths.resourcesAlloy = path.join(paths.resources,'alloy');

	// validate project and "app" paths
	if (!fs.existsSync(paths.project)) {
		exports.die('Titanium project path does not exist at "' + paths.project + '".');
	} else if (!fs.existsSync(path.join(paths.project,'tiapp.xml'))) {
		exports.die('Invalid Titanium project path (no tiapp.xml) at "' + paths.project + '"');
	} else if (!fs.existsSync(paths.app)) {
		exports.die('Alloy "app" directory does not exist at "' + paths.app + '"');
	} else if (!fs.existsSync(paths.index) && (opts.command !== CONST.COMMANDS.GENERATE)) {
		exports.die('Alloy "app" directory has no "' + paths.indexBase + '" file at "' + paths.index + '".');
	}

	// TODO: https://jira.appcelerator.org/browse/TIMOB-14683
	// Resources/app.js must be present, even if not used
	var appjs = path.join(paths.resources, 'app.js');
	if (!fs.existsSync(appjs)) {
		wrench.mkdirSyncRecursive(paths.resources, 0755);
		fs.writeFileSync(appjs, '');
	}

	return paths;
};

exports.createErrorOutput = function(msg, e) {
	var errs = [msg || 'An unknown error occurred'];
	var posArray = [];

	if (e) {
		var line = e.line || e.lineNumber;
		if (e.message) { errs.push(e.message.split('\n')); }
		if (line)  { posArray.push('line ' + line); }
		if (e.col) { posArray.push('column ' + e.col); }
		if (e.pos) { posArray.push('position ' + e.pos); }
		if (posArray.length) { errs.push(posArray.join(', ')); }

		// add the stack trace if we don't get anything good
		if (errs.length < 2) { errs.unshift(e.stack); }
	} else {
		errs.unshift(e.stack);
	}

	return errs;
};

exports.updateFiles = function(srcDir, dstDir, opts) {
	opts = opts || {};
	opts.rootDir = opts.rootDir || dstDir;
	var copiedFiles = [];

	if (!fs.existsSync(srcDir)) {
		return;
	}
	logger.trace('SRC_DIR=' + srcDir);

	if (!fs.existsSync(dstDir)) {
		wrench.mkdirSyncRecursive(dstDir, 0755);
	}

  // don't process XML/controller files inside .svn folders (ALOY-839)
  var excludeRegex = new RegExp('(?:^|[\\/\\\\])(?:' + CONST.EXCLUDED_FILES.join('|') + ')(?:$|[\\/\\\\])');
	var ordered = [];
	_.each(wrench.readdirSyncRecursive(srcDir), function(file) {
		var src = path.join(srcDir,file);
		var dst = path.join(dstDir,file);

		if (excludeRegex.test(src)) {
			return;
		}

		// make sure the file exists and that it is not filtered
		if (!fs.existsSync(src) ||
			(opts.filter && opts.filter.test(file)) ||
			(opts.exceptions && _.contains(opts.exceptions, file)) ||
			(opts.restrictionPath && src !== opts.restrictionPath)) {
			return;
		}

		// if this is the current platform-specific folder, adjust the dst path
		var parts = file.split(/[\/\\]/);
		if (opts.titaniumFolder && parts[0] === opts.titaniumFolder) {
			if(opts.type && opts.type !== 'ASSETS' && parts[0] === 'iphone') {
				// don't copy files in lib/iphone or vendor/iphone
				return;
			}
			dst = path.join(dstDir, parts.slice(1).join('/'));
			ordered.push({ src:src, dst:dst });
		} else if(opts.titaniumFolder&& opts.titaniumFolder === 'iphone' && opts.type && opts.type !== 'ASSETS' && parts[0] === 'ios') {
			// copy files in lib/ios and vendor/ios
			dst = path.join(dstDir, parts.slice(1).join('/'));
			ordered.push({ src:src, dst:dst });
		} else {
			ordered.unshift({ src:src, dst:dst });
		}
	});

	_.each(ordered, function(o) {
		var src = o.src;
		var dst = o.dst;
		var srcStat = fs.statSync(src);
		if (fs.existsSync(dst)) {
			var dstStat = fs.statSync(dst);

			if (!dstStat.isDirectory()) {
				// copy file in if it is a JS file or if its mtime is
				// greater than the one in Resources
				if (path.extname(src) === '.js' || opts.themeChanged || opts.isNew ||
					srcStat.mtime.getTime() > dstStat.mtime.getTime()) {
					logger.trace('Copying ' +
						path.join('SRC_DIR', path.relative(srcDir, src)).yellow + ' --> ' +
						path.relative(opts.rootDir, dst).yellow);
					exports.copyFileSync(src, dst);
					copiedFiles.push(path.relative(path.join(opts.rootDir, 'Resources'), dst));
				}
			}
		} else {
			if (srcStat.isDirectory()) {
				logger.trace('Creating directory ' + path.relative(opts.rootDir, dst).yellow);
				wrench.mkdirSyncRecursive(dst, 0755);
			} else {
				logger.trace('Copying ' + path.join('SRC_DIR', path.relative(srcDir, src)).yellow +
					' --> ' + path.relative(opts.rootDir, dst).yellow);
				exports.copyFileSync(src, dst);
				copiedFiles.push(path.relative(path.join(opts.rootDir, 'Resources'), dst));
			}
		}
		if(!srcStat.isDirectory() && opts.createSourceMap && path.extname(src) === '.js') {
			var tpath = path.join(opts.rootDir,'build','map','Resources',(opts.compileConfig.alloyConfig.platform === 'ios' ? 'iphone' : opts.compileConfig.alloyConfig.platform),'alloy');
			var target = {
				filename: path.join(tpath, path.basename(src)),
				filepath: path.dirname(dst),
				template: dst
			},
			data = {
				'__MAPMARKER_NONCONTROLLER__': {
					filename: src,
					filepath: path.dirname(src),
				}
			};
			sourceMapper.generateSourceMap({
				target: target,
				data: data,
				origFile: {
					filename: src,
					filepath: path.dirname(src)
				}
			}, opts.compileConfig);
		}
	});
	logger.trace('');

	return copiedFiles;
};

exports.getWidgetDirectories = function(appDir) {
	var configPath = path.join(appDir, 'config.json');
	var appWidgets = [];
	if (fs.existsSync(configPath)) {
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
	widgetPaths.push(path.join(appDir,'widgets'));

	_.each(widgetPaths, function(widgetPath) {
		if (fs.existsSync(widgetPath)) {
			var wFiles = fs.readdirSync(widgetPath);
			for (var i = 0; i < wFiles.length; i++) {
				var wDir = path.join(widgetPath,wFiles[i]);
				if (fs.statSync(wDir).isDirectory() &&
					_.indexOf(fs.readdirSync(wDir), 'widget.json') !== -1) {

					var manifest;
					try {
						manifest = jsonlint.parse(fs.readFileSync(
							path.join(wDir, 'widget.json'), 'utf8'));
					} catch (e) {
						exports.die('Error parsing "widget.json" for "' + path.basename(wDir) +
							'"', e);
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
		if (collection === null) { return; }

        dirs.push(collection);
		for (var dependency in collection.manifest.dependencies) {
			walkWidgetDependencies(collections[dependency]);
		}
	}

	// walk the dependencies, tracking any missing widgets
	var notFound = [];
    for (var id in appWidgets) {
		if (!collections[id]) {
			notFound.push(id);
		} else {
			walkWidgetDependencies(collections[id]);
		}
    }

    // if there are missing widgets, abort and tell the developer which ones
    if (!!notFound.length) {
		exports.die([
			'config.json references non-existent widgets: ' + JSON.stringify(notFound),
			'If you are not using these widgets, remove them from your config.json dependencies.',
			'If you are using them, add them to your project\'s widget folder.'
		]);
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
};

exports.rmdirContents = function(dir, exceptions) {
	var files;
	try {
		files = fs.readdirSync(dir);
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
};

exports.resolveAppHome = function() {
	var indexView = path.join(CONST.DIR.VIEW,CONST.NAME_DEFAULT + '.' + CONST.FILE_EXT.VIEW);
	var paths = [ path.join('.','app'), path.join('.') ];

	// Do we have an Alloy project? Find views/index.xml.
	for (var i = 0; i < paths.length; i++) {
		paths[i] = path.resolve(paths[i]);
		var testPath = path.join(paths[i],indexView);
		if (fs.existsSync(testPath)) {
			return paths[i];
		}
	}

	// Report error, show the paths searched.
	var errs = [ 'No valid Alloy project found at the following paths (no "views/index.xml"):' ];
	errs.push(paths);
	exports.die(errs);
};

exports.copyFileSync = function(srcFile, destFile) {
	var BUF_LENGTH = 64 * 1024,
		buff,
		bytesRead,
		fdr,
		fdw,
		pos;
	buff = new Buffer(BUF_LENGTH);
	fdr = fs.openSync(srcFile, 'r');
	exports.ensureDir(path.dirname(destFile));
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
};

exports.ensureDir = function(p) {
	if (!fs.existsSync(p)) {
		wrench.mkdirSyncRecursive(p, 0755);
	}
};

exports.die = function(msg, e) {
	if (e) {
		logger.error(exports.createErrorOutput(msg, e));
	} else {
		logger.error(msg);
	}
	process.exit(1);
};

exports.dieWithNode = function(node, msg) {
	msg = _.isArray(msg) ? msg : [msg];
	msg.unshift('Error with <' + node.nodeName + '> at line ' + node.lineNumber);
	exports.die(msg);
};

exports.changeTime = function(file) {
	if (!fs.existsSync(file)) { return -1; }
	var stat = fs.statSync(file);
	return Math.max(stat.mtime.getTime(),stat.ctime.getTime());
};

exports.stripColors = function(str) {
	return str.replace(/\x1B\[([0-9]{1,2}(;[0-9]{1,2})?)?[m|K]/g, '');
};

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
		},
		cleanhook: {
			file: CONST.HOOK_FILE_CLEAN,
			src: path.join(alloyPath,'hooks'),
			dest: path.join(projectPath,'plugins',id,'hooks')
		}
	};

	_.each(plugins, function(o, type) {
		var srcFile = path.join(o.src,o.file);
		var destFile = path.join(o.dest,o.file);

		// skip if the src and dest are the same file
		if (fs.existsSync(destFile) &&
			fs.readFileSync(srcFile,'utf8') === fs.readFileSync(destFile,'utf8')) {
			return;
		}
		exports.ensureDir(o.dest);
		exports.copyFileSync(srcFile, destFile);

		logger.info('Deployed ti.alloy ' + type + ' to ' + destFile);
	});

	// add the plugin to tiapp.xml, if necessary
	tiapp.init(path.join(projectPath, 'tiapp.xml'));
	tiapp.installPlugin({
		id: 'ti.alloy',
		version: '1.0'
	});
};

exports.normalizeReturns = function(s) {
	return s.replace(/\r\n/g, '\n');
};

exports.createHash = function(files) {
	if (_.isString(files)) {
		files = [files];
	} else if (!_.isArray(files)) {
		throw new TypeError('bad argument');
	}

	var source = '';
	_.each(files, function(f) {
		source += util.format('%s\n%s\n', f, fs.existsSync(f) ? fs.readFileSync(f, 'utf8') : '');
	});

	return crypto.createHash('md5').update(source).digest('hex');
};

exports.createHashFromString = function(string) {
	if (!_.isString(string)) {
		throw new TypeError('bad argument');
	}
	return crypto.createHash('md5').update(string).digest('hex');
};

exports.proxyPropertyNameFromFullname = function(fullname) {
	var nameParts = fullname.split('.');
	return exports.lcfirst(nameParts[nameParts.length-1]);
};

/*
Two date-related functions for ALOY-263
	- used by compile/parsers/Ti.UI.Picker.js and compile/styler.js
*/
exports.isValidDate = function(d, dateField) {
	// not using _.isDate() because it accepts some invalid date strings
	if(!require('moment')(d).isValid()) {
		exports.die("Invalid date string. " + dateField + " must be a string that can be parsed by MomentJS's `moment()` constructor.");
	} else {
		return true;
	}
};
exports.createDate = function(val) {
	return require('moment')(val).toDate();
};

exports.isLocaleAlias = function(string) {
	return /^\s*L\((['\"])(.+)\1\)\s*$/.test(string);
};

exports.getDeploymentTargets = function(projDir) {
	var tiappPath = path.join(projDir,'tiapp.xml'),
		tiappDoc,
		targets;

	if (fs.existsSync(tiappPath)) {
		tiapp.init(tiappPath);
		targets = tiapp.getDeploymentTargets().join(',');
	} else {
		targets = CONST.PLATFORMS.join(',');
	}

	return targets;
};
