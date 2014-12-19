var colors = require('colors'),
	fs = require('fs-extra'),
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
				logger.error('failed remove a empty directory. please remove of manual ' + args.path.cyan);
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
	var destination = args[1];

	if (!destination) {
		U.die('bulk move requires a DESTINATION as second argument');
	}

	if (!source) {
		U.die('bulk move requires a SOURCE as first argument');
	}

	// make sure we have a valid project path
	var paths = U.getAndValidateProjectPaths(program.projectDir || program.outputPath || process.cwd());
	program.projectDir = program.outputPath = paths.project;

	var controller = {
		source: path.join(paths.app, CONST.DIR.CONTROLLER, source + '.' + CONST.FILE_EXT.CONTROLLER),
		destination: path.join(paths.app, CONST.DIR.CONTROLLER, destination + '.' + CONST.FILE_EXT.CONTROLLER),
		exists: {}
	};
	controller.exists = {
		source: fs.existsSync(controller.source),
		destination: fs.existsSync(controller.destination)
	};
	var view = {
		source: path.join(paths.app, CONST.DIR.VIEW, source + '.' + CONST.FILE_EXT.VIEW),
		destination: path.join(paths.app, CONST.DIR.VIEW, destination + '.' + CONST.FILE_EXT.VIEW),
		exists: {}
	};
	view.exists = {
		source: fs.existsSync(view.source),
		destination: fs.existsSync(view.destination)
	};
	var style = {
		source: path.join(paths.app, CONST.DIR.STYLE, source + '.' + CONST.FILE_EXT.STYLE),
		destination: path.join(paths.app, CONST.DIR.STYLE, destination + '.' + CONST.FILE_EXT.STYLE),
		exists: {}
	};
	style.exists = {
		source: fs.existsSync(style.source),
		destination: fs.existsSync(style.destination)
	};

	var logs = [];

	if (!program.force &&
		(controller.exists.destination || view.exists.destination || style.exists.destination)) {
		logs = [
			'destination files already exists'
		];
		controller.exists.destination && logs.push('    controller: ' + controller.destination);
		view.exists.destination && logs.push('    view: ' + view.destination);
		style.exists.destination && logs.push('    style: ' + style.destination);
		U.die(logs.join('\n'));
	}

	if (controller.exists.source && view.exists.source && style.exists.source) {
		fs.move(controller.source, controller.destination, {
				clobber: true
			}, function(err){
				if (err) {
					logger.error('move failed view-style-controller ' + controller.source.cyan + ' -> ' + controller.destination.cyan);
				} else {
					logger.info('moved view-style-controller ' + controller.source.cyan + ' -> ' + controller.destination.cyan);
					cleanup({
						root: path.join(paths.app, CONST.DIR.CONTROLLER),
						path: _.initial(path.join(paths.app, CONST.DIR.CONTROLLER, source).split(path.sep)).join(path.sep)
					});
				}
		});

		fs.move(view.source, view.destination, {
				clobber: true
			}, function(err){
				if (err) {
					logger.error('move failed view ' + view.source.cyan + ' -> ' + view.destination.cyan);
				} else {
					logger.info('moved view ' + view.source.cyan + ' -> ' + view.destination.cyan);
					cleanup({
						root: path.join(paths.app, CONST.DIR.VIEW),
						path: _.initial(path.join(paths.app, CONST.DIR.VIEW, source).split(path.sep)).join(path.sep)
					});
				}
		});

		fs.move(style.source, style.destination, {
				clobber: true
			}, function(err){
				if (err) {
					logger.error('move failed style ' + style.source.cyan + ' -> ' + style.destination.cyan);
				} else {
					logger.info('moved style ' + style.source.cyan + ' -> ' + style.destination.cyan);
					cleanup({
						root: path.join(paths.app, CONST.DIR.STYLE),
						path: _.initial(path.join(paths.app, CONST.DIR.STYLE, source).split(path.sep)).join(path.sep)
					});
				}
		});
	} else {
		logs = [
			'source files does not found'
		];
		!controller.exists.source && logs.push('    controller: ' + controller.source);
		!view.exists.source && logs.push('    view: ' + view.source);
		!style.exists.source && logs.push('    style: ' + style.source);
		U.die(logs.join('\n'));
	}
};