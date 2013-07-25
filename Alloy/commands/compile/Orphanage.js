var fs = require('fs'),
	path = require('path'),
	wrench = require('wrench'),
	logger = require('../../logger'),
	CONST = require('../../common/constants'),
	_ = require('../../lib/alloy/underscore');

var paths, platform;

function Orphanage(_paths, _platform) {
	platform = _platform;
	paths = _.clone(_paths);
}

function extension(file, newExt) {
	return file.replace(/[^\.]+$/, newExt);
}

function remove(folder, types, exceptions) {
	var runtimePath = path.join(paths.resourcesAlloy, folder);
	types = _.isString(types) ? [types] : types;
	exceptions = exceptions || [];

	// skip if the target runtime folder doesn't exist
	if (!fs.existsSync(runtimePath)) {
		return;
	}

	_.each(wrench.readdirSyncRecursive(runtimePath), function(file) {
		var runtimeFullpath = path.join(runtimePath, file);
		var stat = fs.statSync(runtimeFullpath);
		var found = false;
		var checks = [];
		var i;

		// skip exceptions
		for (i = 0; i < exceptions.length; i++) {
			if (_.contains([exceptions[i], path.join(platform, exceptions[i])], file)) {
				return;
			}
		}

		// is this is a file or directory?
		if (stat.isDirectory()) {
			_.each(types, function(type) {
				checks.push(
					path.join(paths.app, CONST.DIR[type], file),
					path.join(paths.app, CONST.DIR[type], platform, file)
				);
			});
		} else {
			_.each(types, function(type) {
				checks.push(
					path.join(paths.app, CONST.DIR[type],
						extension(file, CONST.FILE_EXT[type])),
					path.join(paths.app, CONST.DIR[type], platform,
						extension(file, CONST.FILE_EXT[type]))
				);
			});
		}

		console.log(checks);

		// If we find the corresponding app folder file(s), skip this file
		for (i = 0; i < checks.length; i++) {
			if (fs.existsSync(checks[i])) {
				found = true;
				return;
			}
		}

		if (!found) {
			console.log('ORPHAN: ' + runtimeFullpath);
			// delete, might be folder or file
		}
	});
}

Orphanage.prototype.remove = function(opts) {
	opts = opts || {};
	this.removeControllers();
	this.removeStyles();
	this.removeModels();
};

Orphanage.prototype.removeControllers = function() {
	remove(CONST.DIR.CONTROLLER, ['CONTROLLER','VIEW'], ['BaseController.js']);
};

Orphanage.prototype.removeModels = function() {
	remove(CONST.DIR.MODEL, 'MODEL');
};

Orphanage.prototype.removeStyles = function() {
	remove(CONST.DIR.STYLE, ['CONTROLLER','VIEW']);
};

// Orphanage.prototype.removeWidgets = function() {
// 	remove(CONST.DIR.WIDGET, 'WIDGET');
// };

module.exports = Orphanage;