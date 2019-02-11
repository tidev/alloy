/*
	Speeds compilation by not re-copying, re-generating, or deleting some files
	on subsequent compiles. For example, the base client-side lib, alloy.js, is
	not deleted and recopied after the initial compile.
*/
var fs = require('fs-extra'),
	walkSync = require('walk-sync'),
	path = require('path'),
	platforms = require('../../../platforms/index'),
	logger = require('../../logger'),
	CONST = require('../../common/constants'),
	U = require('../../utils'),
	_ = require('lodash');

var ALLOY_ROOT = path.join(__dirname, '..', '..');

var dirs, platform, titaniumFolder, theme, adapters;
var widgetsInUse = {};

function Orphanage(projectDir, _platform, opts) {
	opts = opts || {};
	platform = _platform;
	titaniumFolder = platforms[platform].titaniumFolder;
	theme = opts.theme;
	adapters = opts.adapters || [];

	// gather directories to be used throughout Orphanage
	var resourcesDir = path.join(projectDir, CONST.RESOURCES_DIR);
	dirs = {
		app: path.join(projectDir, CONST.ALLOY_DIR),
		resources: path.join(projectDir, CONST.RESOURCES_DIR),
		runtime: path.join(resourcesDir, platforms[platform].titaniumFolder, CONST.ALLOY_RUNTIME_DIR)
	};

	// get widgets in use
	_.each(U.getWidgetDirectories(dirs.app) || [], function(wObj) {
		widgetsInUse[path.basename(wObj.dir)] = wObj.dir;
	});
}
module.exports = Orphanage;

Orphanage.prototype.clean = function() {
	var that = this;

	// Clean the base app folder
	this.removeAll();

	// get rid of unused adapters
	logger.debug('Removing orphaned sync adapters...');
	this.removeAdapters();

	// Clean out each widget
	var widgets = path.join(dirs.runtime, CONST.DIR.WIDGET);
	if (fs.existsSync(widgets)) {
		_.each(fs.readdirSync(widgets), function(file) {
			if (!widgetsInUse[file]) {
				that.removeAll({ widgetId: file });
			}
		});
	}

	// assets must be cleaned up last
	logger.debug('Removing orphaned assets and libs...');
	this.removeAssets();
};

// TODO: handle specs
Orphanage.prototype.removeAll = function(opts) {
	opts = opts || {};

	if (!opts.widgetId) {
		logger.debug('Removing orphaned controllers ...');
		this.removeControllers(opts);

		logger.debug('Removing orphaned models ...');
		this.removeModels(opts);

		logger.debug('Removing orphaned styles ...');
		this.removeStyles(opts);
	} else {
		this.removeWidget(opts);
	}
};

Orphanage.prototype.removeAdapters = function(opts) {
	opts = _.clone(opts || {});
	var paths = [
		path.join('alloy', 'sync'),
		path.join(titaniumFolder, 'alloy', 'sync')
	];

	_.each(paths, function(p) {
		var adapterDir = path.join(dirs.resources, p);
		if (!fs.existsSync(adapterDir)) {
			return;
		}

		_.each(fs.readdirSync(adapterDir), function(adapterFile) {
			var fullpath = path.join(adapterDir, adapterFile);
			var adapterName = adapterFile.replace(/\.js$/, '');
			if (!_.includes(adapters, adapterName) && fs.statSync(fullpath).isFile()) {
				logger.trace('* ' + path.join(p, adapterFile));
				fs.unlinkSync(fullpath);
			}
		});
	});
};

Orphanage.prototype.removeControllers = function(opts) {
	opts = _.clone(opts || {});
	remove(_.extend(opts, {
		folder: CONST.DIR.CONTROLLER,
		types: ['CONTROLLER', 'VIEW'],
		exceptions: ['BaseController.js']
	}));
};

Orphanage.prototype.removeModels = function(opts) {
	opts = _.clone(opts || {});
	remove(_.extend(opts, {
		folder: CONST.DIR.MODEL,
		types: 'MODEL'
	}));
};

Orphanage.prototype.removeStyles = function(opts) {
	opts = _.clone(opts || {});
	remove(_.extend(opts, {
		folder: CONST.DIR.STYLE,
		types: ['CONTROLLER', 'VIEW']
	}));
};

Orphanage.prototype.removeAssets = function() {
	var baseLocations = [
		CONST.DIR.ASSETS,
		path.join(CONST.DIR.ASSETS, platforms[platform].titaniumFolder),
		CONST.DIR.LIB,
		CONST.DIR.VENDOR
	];
	var locations = [];

	// Add the base locations
	_.each(baseLocations, function(loc) {
		var newLoc = path.join(dirs.app, loc);
		if (fs.existsSync(newLoc)) {
			locations.push(newLoc);
		}
	});

	// Make sure we check the widgets paths as well
	_.each(widgetsInUse, function(wDir, wId) {
		_.each(baseLocations, function(loc) {
			var widgetLoc = path.join(wDir, loc);
			if (fs.existsSync(widgetLoc)) {
				locations.push(widgetLoc);
			}
		});
	});

	// add theme locations, if necessary
	if (theme) {
		locations.push(
			path.join(dirs.app, CONST.DIR.THEME, theme, CONST.DIR.ASSETS),
			path.join(dirs.app, CONST.DIR.THEME, theme, CONST.DIR.ASSETS, platform)
		);
	}

	// files to skip
	var exceptions = [
		'app.js',
		'alloy.js',
		'alloy',
		'alloy/*'
	];

	// check the current platform as well
	_.each(_.clone(exceptions), function(ex) {
		exceptions.push(path.join(platforms[platform].titaniumFolder, ex));
	});

	// don't worry about cleaning platforms that aren't the current target
	_.each(_.without(_.map(platforms, 'titaniumFolder'), platforms[platform].titaniumFolder),
		function(tf) {
			exceptions.unshift(tf + '*');
		}
	);

	remove({
		runtimePath: dirs.resources,
		locations: locations,
		exceptions: exceptions
	});
};

Orphanage.prototype.removeWidget = function(opts) {
	if (opts.widgetId === '.DS_Store') { return; }
	opts.runtimePath = path.join(dirs.runtime, CONST.DIR.WIDGET, opts.widgetId);
	remove(opts);
};

// private function
function extension(file, newExt) {
	return file.replace(/[^\.]+$/, newExt);
}

function getChecks(file, fullpath, opts) {
	opts = opts || {};
	var isDir = fs.statSync(fullpath).isDirectory();
	var checks = [];

	// Check all the app folder file types
	if (opts.types) {
		_.each(opts.types, function(type) {
			var dir = CONST.DIR[type];

			// use type-specific extension if it's not a directory
			if (!isDir) {
				file = extension(file, CONST.FILE_EXT[type]);
			}

			// use widget path, if it's a widget
			if (opts.widgetId) {
				dir = path.join(CONST.DIR.WIDGET, opts.widgetId, dir);
			}

			// create the file checks
			checks.push(
				path.join(dirs.app, dir, file),
				path.join(dirs.app, dir, platform, file)
			);
		});

	// use explicit full location paths
	} else if (opts.locations) {
		// strip off the platform if present
		var parts = file.split(/[\\\/]/);
		if (parts[0] === titaniumFolder) {
			parts.shift();
		}
		file = parts.join('/');

		// Is it a widget file?
		var keys = _.keys(widgetsInUse);
		for (var i = 0; i < keys.length; i++) {
			var widgetId = keys[i];

			// did we find the widget root path?
			if (parts.length === 1 && parts[0] === widgetId) {
				return null;
			}

			// is this a widget asset?
			if (_.includes(parts, widgetId)) {
				file = _.without(parts, widgetId).join('/');
				break;
			}
		}

		// No widget? Just use the given locations.
		_.each(opts.locations, function(loc) {
			checks.push(path.join(loc, file));
		});
	}

	return checks;
}

function isException(file, exceptions) {
	var ex, exs = [];
	exceptions = exceptions || [];

	for (var i = 0; i < exceptions.length; i++) {
		ex = exceptions[i];
		exs.push(ex);

		// handle folder wildcards
		if (ex.charAt(ex.length - 1) === '*') {
			for (var j = 0; j < exs.length; j++) {
				var newEx = exs[i].substr(0, exs[i].length - 2);

				// see if the file starts with the wildcard
				if (file.length >= newEx.length && file.substr(0, newEx.length) === newEx) {
					return true;
				}
			}

		// straight up comparison if there's no wildcards
		} else if (_.includes(exs, file)) {
			return true;
		}
	}

	return false;
}

function remove(opts) {
	opts = opts || {};
	var folder = opts.folder;
	var exceptions = opts.exceptions || [];
	var types = _.isString(opts.types) ? [opts.types] : opts.types;
	var locations = _.isString(opts.locations) ? [opts.locations] : opts.locations;
	var runtimePath = opts.runtimePath;

	// Set the base runtime search path
	if (!runtimePath) {
		if (!folder) {
			U.die([
				'You must specify either "runtimePath" or "folder" when calling Orphanage.remove()',
				new Error().stack
			]);
		} else {
			if (opts.widgetId) {
				runtimePath = path.join(dirs.runtime, CONST.DIR.WIDGET, opts.widgetId, folder);
			} else {
				runtimePath = path.join(dirs.runtime, folder);
			}
		}
	}

	// skip if the target runtime folder doesn't exist
	if (!fs.existsSync(runtimePath)) {
		return;
	}

	// Let's see if we need to delete any orphan files...
	_.each(walkSync(runtimePath), function(file) {
		file = path.normalize(file);
		var runtimeFullpath = path.join(runtimePath, file);
		var found = false;
		var checks, i;

		// skip if file no longer exists, or if it's an exception
		if (!fs.existsSync(runtimeFullpath) ||
			(/*!opts.widgetId && */ isException(file, exceptions))) {
			return;
		}

		// Get a list of app folder locations to check for a match against the runtime file
		checks = getChecks(file, runtimeFullpath, _.extend({ widgetId: opts.widgetId },
			types ? { types: types } : { locations: locations }));

		// if checks is null, we already know we can skip it
		if (checks === null) {
			return;
		}

		// If we find the corresponding app folder file(s), skip this file
		for (i = 0; i < checks.length; i++) {
			if (!opts.widgetId && fs.existsSync(checks[i])) {
				found = true;
				return;
			}
		}

		// It's an orphan, delete it
		if (!found) {
			// already deleted, perhaps a file in a deleted directory
			if (!fs.existsSync(runtimeFullpath)) { return; }
			logger.trace('* ' + file);

			// delete the directory or file
			var targetStat = fs.statSync(runtimeFullpath);
			if (targetStat.isDirectory()) {
				if (opts.widgetId) {
					// remove the widget's folder
					fs.removeSync(path.resolve(runtimeFullpath, '..'));
				} else {
					fs.removeSync(runtimeFullpath);
				}
			} else {
				fs.unlinkSync(runtimeFullpath);
			}
		}
	});
}
