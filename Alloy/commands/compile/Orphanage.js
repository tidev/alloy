var fs = require('fs'),
	path = require('path'),
	wrench = require('wrench'),
	platforms = require('../../../platforms/index'),
	logger = require('../../logger'),
	CONST = require('../../common/constants'),
	U = require('../../utils'),
	_ = require('../../lib/alloy/underscore');

var ALLOY_ROOT = path.join(__dirname, '..', '..');

var dirs, platform, titaniumFolder, theme;
var widgets = {};

function Orphanage(projectDir, _platform, opts) {
	opts = opts || {};
	platform = _platform;
	titaniumFolder = platforms[platform].titaniumFolder;
	theme = opts.theme;

	// gather directories to be used throughout Orphanage
	var resourcesDir = path.join(projectDir, CONST.RESOURCES_DIR);
	dirs = {
		app: path.join(projectDir, CONST.ALLOY_DIR),
		resources: path.join(projectDir, CONST.RESOURCES_DIR),
		runtime: path.join(resourcesDir, CONST.ALLOY_RUNTIME_DIR)
	};

	// get widgets in use
	_.each(U.getWidgetDirectories(dirs.app) || [], function(wObj) {
		widgets[path.basename(wObj.dir)] = wObj.dir;
	});
}
module.exports = Orphanage;

Orphanage.prototype.clean = function() {
	var that = this;

	// Clean the base app folder
	this.removeAll();

	// Clean out each widget
	var widgets = path.join(dirs.runtime, CONST.DIR.WIDGET);
	if (fs.existsSync(widgets)) {
		_.each(fs.readdirSync(widgets), function(file) {
			that.removeAll({ widgetId: file });
		});
	}

	// assets must be cleaned up last
	logger.debug('Removing orphaned assets and libs...');
	this.removeAssets();
};

Orphanage.prototype.removeAll = function(opts) {
	opts = opts || {};
	var suffix = opts.widgetId ? ' from widget "' + opts.widgetId + "'" : '';

	logger.debug('Removing orphaned controllers' + suffix + '...');
	this.removeControllers(opts);

	logger.debug('Removing orphaned models' + suffix + '...');
	this.removeModels(opts);

	logger.debug('Removing orphaned styles' + suffix + '...');
	this.removeStyles(opts);
};

Orphanage.prototype.removeControllers = function(opts) {
	opts = _.clone(opts || {});
	remove(_.extend(opts, {
		folder: CONST.DIR.CONTROLLER,
		types: ['CONTROLLER','VIEW'],
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
		types: ['CONTROLLER','VIEW']
	}));
};

Orphanage.prototype.removeAssets = function() {
	var locations = [
		path.join(dirs.app, CONST.DIR.ASSETS),
		path.join(dirs.app, CONST.DIR.ASSETS, platforms[platform].titaniumFolder),
		path.join(dirs.app, CONST.DIR.LIB),
		path.join(dirs.app, CONST.DIR.VENDOR)
	];

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
	_.each(_.without(_.pluck(platforms, 'titaniumFolder'), platforms[platform].titaniumFolder),
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
		// Is it a widget file?
		var keys = _.keys(widgets);
		for (var i = 0; i < keys.length; i++) {
			var widgetId = keys[i];
			var parts = file.split(/[\\\/]/);

			// strip off the platform if present
			if (parts[0] === titaniumFolder) { parts.shift(); }

			// did we find the widget root path?
			if (parts.length === 1 && parts[0] === widgetId) {
				return null;
			}

			// is this a widget asset?
			if (_.contains(parts, widgetId)) {
				var wDir = widgets[widgetId];
				var wFile = _.without(parts, widgetId).join('/');
				checks.push(
					path.join(wDir, CONST.DIR.ASSETS, wFile),
					path.join(wDir, CONST.DIR.ASSETS, platform, wFile),
					path.join(wDir, CONST.DIR.LIB, wFile),
					path.join(wDir, CONST.DIR.VENDOR, wFile)
				);
				return checks;
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
		if (ex.charAt(ex.length-1) === '*') {
			for (var j = 0; j < exs.length; j++) {
				var newEx = exs[i].substr(0, exs[i].length-2);

				// see if the file starts with the wildcard
				if (file.length >= newEx.length && file.substr(0, newEx.length) === newEx) {
					return true;
				}
			}

		// straight up comparison if there's no wildcards
		} else if (_.contains(exs, file)) {
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
			logger.die([
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
	_.each(wrench.readdirSyncRecursive(runtimePath), function(file) {
		var runtimeFullpath = path.join(runtimePath, file);
		var found = false;
		var checks, i;

		// skip exceptions
		if (!opts.widgetId && isException(file, exceptions)) {
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
			if (fs.existsSync(checks[i])) {
				found = true;
				return;
			}
		}

		// It's an orphan, delete it
		if (!found) {
			// already deleted, perhaps a file in a deleted directory
			if (!fs.existsSync(runtimeFullpath)) { return; }
			logger.trace('* ' + file);

			// delete the directory ot file
			var targetStat = fs.statSync(runtimeFullpath);
			if (targetStat.isDirectory()) {
				wrench.rmdirSyncRecursive(runtimeFullpath, true);
			} else {
				fs.unlinkSync(runtimeFullpath);
			}
		}
	});
}
