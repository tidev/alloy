// The island of misfit toys... for functions

var path = require('path'),
	fs = require('fs-extra'),
	walkSync = require('walk-sync'),
	chmodr = require('chmodr'),
	colors = require('colors'),
	crypto = require('crypto'),
	util = require('util'),
	jsonlint = require('jsonlint'),
	resolve = require('resolve'),
	paths = require('global-paths'),
	logger = require('./logger'),
	tiapp = require('./tiapp'),
	XMLSerializer = require('xmldom').XMLSerializer,
	DOMParser = require('xmldom').DOMParser,
	_ = require('lodash'),
	CONST = require('./common/constants'),
	sourceMapper = require('./commands/compile/sourceMapper'),
	codeFrameColumns = require('@babel/code-frame').codeFrameColumns;

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
		return str.replace(/\&amp;/g, '&');
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

		function extractLineData(errorString) {
			var lineData = errorString.match(/@#\[line:(\d+),col:(\d+)\]/);
			var errorInfo = {
				line: null,
				column: null
			};
			if (lineData) {
				errorInfo.line = parseInt(lineData[1], 10);
				errorInfo.column = parseInt(lineData[2], 10);
			}
			return errorInfo;
		}
		try {
			var errorHandler = {};
			errorHandler.error = errorHandler.fatalError = function(m) {
				var errorInfo = extractLineData(m);
				m = m.replace(/@#\[line:(\d+),col:(\d+)\]/, '').trim();
				exports.dieWithCodeFrame(m, errorInfo, string);
			};
			errorHandler.warn = errorHandler.warning = function(m) {
				// ALOY-840: die on unclosed XML tags
				// xmldom hardcodes this as a warning with the string message 'unclosed xml attribute'
				// even when it's a tag that's unclosed
				if (m.indexOf('unclosed xml attribute') === -1) {
					logger.warn((m || '').split(/[\r\n]/));
				} else {
					m = m.replace('unclosed xml attribute', 'Unclosed XML tag or attribute');
					var errorInfo = extractLineData(m);
					exports.dieWithCodeFrame('Unclosed XML tag or attribute', errorInfo, string);
				}
			};
			doc = new DOMParser({errorHandler:errorHandler, locator:{}}).parseFromString(string);
		} catch (e) {
			exports.die('Error parsing XML file.', e);
		}

		return doc;
	},
	parseFromFile: function(filename) {
		var xml = fs.readFileSync(filename, 'utf8');
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
	return fs.readFileSync(path.join(__dirname, 'template', name), 'utf8');
};

exports.evaluateTemplate = function(name, o) {
	return _.template(exports.readTemplate(name))(o);
};

exports.getAndValidateProjectPaths = function(argPath, opts) {
	opts = opts || {};
	var projectPath = path.resolve(argPath);

	// See if we got the "app" path or the project path as an argument
	projectPath = fs.existsSync(path.join(projectPath, '..', 'tiapp.xml')) ?
		path.join(projectPath, '..') : projectPath;

	// Assign paths objects
	var paths = {
		project: projectPath,
		app: path.join(projectPath, 'app'),
		indexBase: path.join(CONST.DIR.CONTROLLER, CONST.NAME_DEFAULT + '.' + CONST.FILE_EXT.CONTROLLER)
	};
	paths.index = path.join(paths.app, paths.indexBase);
	paths.assets = path.join(paths.app, 'assets');
	paths.resources = path.join(paths.project, 'Resources');
	paths.resourcesAlloy = path.join(paths.resources, 'alloy');

	// validate project and "app" paths
	if (!fs.existsSync(paths.project)) {
		exports.die('Titanium project path does not exist at "' + paths.project + '".');
	} else if (!fs.existsSync(path.join(paths.project, 'tiapp.xml'))) {
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
		fs.mkdirpSync(paths.resources);
		chmodr.sync(paths.resources, 0755);
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
		fs.mkdirpSync(dstDir);
		chmodr.sync(dstDir, 0755);
	}

	// don't process XML/controller files inside .svn folders (ALOY-839)
	var excludeRegex = new RegExp('(?:^|[\\/\\\\])(?:' + CONST.EXCLUDED_FILES.join('|') + ')(?:$|[\\/\\\\])');
	var ordered = [];
	_.each(walkSync(srcDir), function(file) {
		file = path.normalize(file);
		var src = path.join(srcDir, file);
		var dst = path.join(dstDir, file);

		if (excludeRegex.test(src)) {
			return;
		}

		// make sure the file exists and that it is not filtered
		if (!fs.existsSync(src) ||
			(opts.filter && opts.filter.test(file)) ||
			(opts.exceptions && _.includes(opts.exceptions, file)) ||
			(opts.restrictionPath && !_.includes(opts.restrictionPath, src)) ) {
			return;
		}

		// if this is the current platform-specific folder, adjust the dst path
		var parts = file.split(/[\/\\]/);
		if (opts.titaniumFolder && parts[0] === opts.titaniumFolder) {
			if (opts.type && opts.type !== 'ASSETS' && parts[0] === 'iphone') {
				// don't copy files in lib/iphone or vendor/iphone
				return;
			}
			dst = path.join(dstDir, parts.slice(1).join('/'));
			ordered.push({ src:src, dst:dst });
		} else if (opts.titaniumFolder && opts.titaniumFolder === 'iphone' && opts.type && opts.type !== 'ASSETS' && parts[0] === 'ios') {
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
				fs.mkdirpSync(dst);
				chmodr.sync(dst, 0755);
			} else {
				logger.trace('Copying ' + path.join('SRC_DIR', path.relative(srcDir, src)).yellow +
					' --> ' + path.relative(opts.rootDir, dst).yellow);
				exports.copyFileSync(src, dst);
				copiedFiles.push(path.relative(path.join(opts.rootDir, 'Resources'), dst));
			}
		}
		if (!srcStat.isDirectory() && opts.createSourceMap && path.extname(src) === '.js') {
			var target = {
					filename: path.relative(opts.compileConfig.dir.project, dst),
					filepath: dst,
					template: src
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
					filename: path.relative(opts.compileConfig.dir.project, src),
					filepath: src
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
			var content = fs.readFileSync(configPath, 'utf8');
			var config = jsonlint.parse(content);
			appWidgets = config.dependencies;

			if (config.global && config.global.theme) {
				var themePath = path.join(appDir, 'themes', config.global.theme, 'config.json');
				if (fs.existsSync(themePath)) {
					var themeContent = fs.readFileSync(themePath, 'utf8');
					var themeConfig = jsonlint.parse(themeContent);
					if (themeConfig.dependencies) {
						appWidgets = _.extend(appWidgets, themeConfig.dependencies);
					}
				}
			}
		} catch (e) {
			exports.die('Error parsing "config.json"', e);
		}
	}

	var dirs = [];
	var collections = [];
	var widgetPaths = [];
	widgetPaths.push(path.join(__dirname, '..', 'widgets'));
	widgetPaths.push(path.join(appDir, 'widgets'));

	_.each(widgetPaths, function(widgetPath) {
		if (fs.existsSync(widgetPath)) {
			var wFiles = fs.readdirSync(widgetPath);
			for (var i = 0; i < wFiles.length; i++) {
				var wDir = path.join(widgetPath, wFiles[i]);
				if (fs.statSync(wDir).isDirectory() &&
					_.indexOf(fs.readdirSync(wDir), 'widget.json') !== -1) {
					var collection = parseManifestAsCollection(path.join(wDir, 'widget.json'));
					collections[collection.manifest.id] = collection;
				}
			}
		}
	});

	function parseManifestAsCollection(wFile) {
		var wDir = path.dirname(wFile);
		var manifest;
		try {
			manifest = jsonlint.parse(fs.readFileSync(wFile, 'utf8'));
		} catch (e) {
			exports.die('Error parsing "' + wFile + '"', e);
		}

		return {
			dir: wDir,
			manifest: manifest
		};
	}

	function findWidgetAsNodeModule(id) {
		var wFile;
		try {
			wFile = resolve.sync(path.join(CONST.NPM_WIDGET_PREFIX + id, 'widget'), { basedir: path.join(appDir, '..'), extensions: [ '.json' ], paths: paths() });
		} catch (err) {
			return;
		}

		var collection = parseManifestAsCollection(wFile);
		if (collection.manifest.id !== id) {
			return logger.warn('Expected "' + wFile + '" to have id "' + id + '" instead of "' + collection.manifest.id + '"');
		}

		var pFile = path.join(path.dirname(wFile), 'package.json');
		var pkg;
		try {
			pkg = jsonlint.parse(fs.readFileSync(pFile, 'utf8'));
		} catch (e) {
			exports.die('Error parsing "' + pFile + '"', e);
		}

		var missingKeywords = _.difference(CONST.NPM_WIDGET_KEYWORDS, pkg.keywords || []);
		if (missingKeywords.length > 0) {
			return logger.warn('Expected "' + pFile + '" to have missing keywords "' + missingKeywords.join('", "') + '"');
		}

		return collection;
	}

	function walkWidgetDependencies(id) {
		var collection = collections[id];

		if (!collection) {
			collection = findWidgetAsNodeModule(id);

			if (!collection) {
				notFound.push(id);
				return;
			}
		}

		dirs.push(collection);
		for (var dependency in collection.manifest.dependencies) {
			walkWidgetDependencies(dependency);
		}
	}

	// walk the dependencies, tracking any missing widgets
	var notFound = [];
	for (var id in appWidgets) {
		walkWidgetDependencies(id);
	}

	// if there are missing widgets, abort and tell the developer which ones
	if (!!notFound.length) { // eslint-disable-line no-extra-boolean-cast
		exports.die([
			'config.json references non-existent widgets: ' + JSON.stringify(notFound),
			'If you are not using these widgets, remove them from your config.json dependencies.',
			'If you are using them, add them to your project\'s widget folder or as NPM package.'
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

/**
 * Converts a raw text value (from XML) into a JS string. If the value is
 * multline, we will concatenate the lines together to avoid broken JS srting syntax.
 * @param  {String} string The raw (or slightly modified/trimmed) XML content
 * @return {String}        JS source string, possibly multiple concatenations to handle multiple lines
 */
exports.possibleMultilineString = function(string) {
	var parts = string.split(/\r?\n/);
	return "'" + parts.join("\\n' + '") + "'";
};

exports.rmdirContents = function(dir, exceptions) {
	var files;
	try {
		files = fs.readdirSync(dir);
	} catch (e) {
		return;
	}

	for (var i = 0, l = files.length; i < l; i++) {
		var currFile = path.join(dir, files[i]);
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
			fs.removeSync(currFile);
		// unlink any files or links
		} else {
			fs.unlinkSync(currFile);
		}
	}
};

exports.resolveAppHome = function() {
	var indexView = path.join(CONST.DIR.VIEW, CONST.NAME_DEFAULT + '.' + CONST.FILE_EXT.VIEW);
	var paths = [ path.join('.', 'app'), path.join('.') ];

	// Do we have an Alloy project? Find views/index.xml.
	for (var i = 0; i < paths.length; i++) {
		paths[i] = path.resolve(paths[i]);
		var testPath = path.join(paths[i], indexView);
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
	fs.copySync(srcFile, destFile, { overwrite: true });
};

exports.ensureDir = function(p) {
	if (!fs.existsSync(p)) {
		fs.mkdirpSync(p);
		chmodr.sync(p, 0755);
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

exports.dieWithCodeFrame = function(errorMessage, lineInfo, fileContents, hint) {
	var frame = codeFrameColumns(fileContents, {
		start: lineInfo
	}, {
		highlightCode: true
	});
	logger.error(errorMessage);
	// Convert the code frame from a string to an Array so that the logger logs
	// each line individually to keep the code frame intact
	logger.error(frame.split('\n'));
	if (hint) {
		logger.info(hint);
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
	return Math.max(stat.mtime.getTime(), stat.ctime.getTime());
};

exports.stripColors = function(str) {
	return str.replace(/\x1B\[([0-9]{1,2}(;[0-9]{1,2})?)?[m|K]/g, '');
};

exports.installPlugin = function(alloyPath, projectPath) {
	var id = 'ti.alloy';
	var plugins = {
		plugin: {
			file: CONST.PLUGIN_FILE,
			src: path.join(alloyPath, 'Alloy', 'plugin'),
			dest: path.join(projectPath, 'plugins', id)
		},
		hook: {
			file: CONST.HOOK_FILE,
			src: path.join(alloyPath, 'hooks'),
			dest: path.join(projectPath, 'plugins', id, 'hooks')
		},
		cleanhook: {
			file: CONST.HOOK_FILE_CLEAN,
			src: path.join(alloyPath, 'hooks'),
			dest: path.join(projectPath, 'plugins', id, 'hooks')
		}
	};

	_.each(plugins, function(o, type) {
		var srcFile = path.join(o.src, o.file);
		var destFile = path.join(o.dest, o.file);

		// skip if the src and dest are the same file
		if (fs.existsSync(destFile) &&
			fs.readFileSync(srcFile, 'utf8') === fs.readFileSync(destFile, 'utf8')) {
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
	return exports.lcfirst(nameParts[nameParts.length - 1]);
};

/*
Two date-related functions for ALOY-263
	- used by compile/parsers/Ti.UI.Picker.js and compile/styler.js
*/
exports.isValidDate = function(d, dateField) {
	// not using _.isDate() because it accepts some invalid date strings
	if (!require('moment')(d).isValid()) {
		exports.die('Invalid date string. ' + dateField + " must be a string that can be parsed by MomentJS's `moment()` constructor.");
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
	var tiappPath = path.join(projDir, 'tiapp.xml'),
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
