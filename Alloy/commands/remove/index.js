var colors = require('colors'),
	fs = require('fs'),
	path = require('path'),
	wrench = require('wrench'),
	_ = require("../../lib/alloy/underscore")._,
	U = require('../../utils'),
	CONST = require('../../common/constants'),
	logger = require('../../logger');

function cleanup(args) {
	args = args || {};

	files = wrench.readdirSyncRecursive(args.path);
	if (files.length === 0) {
		fs.rmdir(args.path, function(err){
			if (err) {
				logger.error('Failed to remove the empty directory. Please manually remove ' + args.path.cyan);
			} else {
				var next = _.initial(args.path.split(path.sep)).join(path.sep);

				if (next !== args.root) {
					cleanup({
						root: args.root,
						path: next
					});
				}
			}
		});
	}
}

module.exports = function(args, program) {
	args = args || [];
	program = program || {};

	var source = args[0];

	if (!source) {
		U.die('bulk remove requires a SOURCE as first argument');
	}

	// make sure we have a valid project path
	var paths = U.getAndValidateProjectPaths(program.projectDir || program.outputPath || process.cwd());
	program.projectDir = program.outputPath = paths.project;

	var controller = {
		source: path.join(paths.app, CONST.DIR.CONTROLLER, source + '.' + CONST.FILE_EXT.CONTROLLER),
		exists: {}
	};
	controller.exists = {
		source: fs.existsSync(controller.source)
	};
	var view = {
		source: path.join(paths.app, CONST.DIR.VIEW, source + '.' + CONST.FILE_EXT.VIEW),
		exists: {}
	};
	view.exists = {
		source: fs.existsSync(view.source)
	};
	var style = {
		source: path.join(paths.app, CONST.DIR.STYLE, source + '.' + CONST.FILE_EXT.STYLE),
		exists: {}
	};
	style.exists = {
		source: fs.existsSync(style.source)
	};

	var logs = [];

	if (!controller.exists.source && !view.exists.source && !style.exists.source) {
		logs = [
			'source files not found'
		];
		!controller.exists.source && logs.push('    controller: ' + controller.source);
		!view.exists.source && logs.push('    view: ' + view.source);
		!style.exists.source && logs.push('    style: ' + style.source);
		U.die(logs.join('\n'));
	}

	if (controller.exists.source) {
		fs.unlink(controller.source, function(err){
			if (err) {
				logger.error('remove failed view-style-controller ' + controller.source.cyan);
			} else {
				logger.info('removed view-style-controller ' + controller.source.cyan);
				cleanup({
					root: path.join(paths.app, CONST.DIR.CONTROLLER),
					path: _.initial(path.join(paths.app, CONST.DIR.CONTROLLER, source).split(path.sep)).join(path.sep)
				});
			}
		});
	}

	if (view.exists.source) {
		fs.unlink(view.source, function(err){
			if (err) {
				logger.error('remove failed view ' + view.source.cyan);
			} else {
				logger.info('removed view ' + view.source.cyan);
				cleanup({
					root: path.join(paths.app, CONST.DIR.VIEW),
					path: _.initial(path.join(paths.app, CONST.DIR.VIEW, source).split(path.sep)).join(path.sep)
				});
			}
		});
	}

	if (style.exists.source) {
		fs.unlink(style.source, function(err){
			if (err) {
				logger.error('remove failed style ' + style.source.cyan);
			} else {
				logger.info('removed style ' + style.source.cyan);
				cleanup({
					root: path.join(paths.app, CONST.DIR.STYLE),
					path: _.initial(path.join(paths.app, CONST.DIR.STYLE, source).split(path.sep)).join(path.sep)
				});
			}
		});
	}
};