var path = require('path'),
	colors = require('colors'),
	fs = require('fs-extra'),
	U = require('../../utils'),
	CONST = require('../../common/constants'),
	logger = require('../../logger');

function copy(source, destination, callback) {
	// make sure the target folder exists
	var fullDir = path.dirname(destination);
	if (!fs.existsSync(fullDir)) {
		fs.mkdirpSync(fullDir);
	}

	var code = fs.readFileSync(source, 'utf8');
	fs.writeFile(destination, code, callback);
}

module.exports = function(args, program) {
	args = args || [];
	program = program || {};

	var source = args[0];
	var destination = args[1];

	if (!destination) {
		U.die('bulk copy requires a DESTINATION as second argument');
	}

	if (!source) {
		U.die('bulk copy requires a SOURCE as first argument');
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

	if (!controller.exists.source && !view.exists.source && !style.exists.source) {
		logs = [
			'source files not found'
		];
		!controller.exists.source && logs.push('    controller: ' + controller.source);
		!view.exists.source && logs.push('    view: ' + view.source);
		!style.exists.source && logs.push('    style: ' + style.source);
		U.die(logs.join('\n'));
	}

	if (!program.force &&
		(controller.exists.destination || view.exists.destination || style.exists.destination)) {
		logs = [
			'destination files already exist'
		];
		controller.exists.destination && logs.push('    controller: ' + controller.destination);
		view.exists.destination && logs.push('    view: ' + view.destination);
		style.exists.destination && logs.push('    style: ' + style.destination);
		U.die(logs.join('\n'));
	}

	if (controller.exists.source) {
		copy(controller.source, controller.destination, function(err) {
			if (err) {
				logger.error('copy failed view-style-controller ' + controller.source.cyan + ' -> ' + controller.destination.cyan);
			} else {
				logger.info('copied view-style-controller ' + controller.source.cyan + ' -> ' + controller.destination.cyan);
			}
		});
	}

	if (view.exists.source) {
		copy(view.source, view.destination, function(err) {
			if (err) {
				logger.error('copy failed view ' + view.source.cyan + ' -> ' + view.destination.cyan);
			} else {
				logger.info('copied view ' + view.source.cyan + ' -> ' + view.destination.cyan);
			}
		});
	}

	if (style.exists.source) {
		copy(style.source, style.destination, function(err) {
			if (err) {
				logger.error('copy failed style ' + style.source.cyan + ' -> ' + style.destination.cyan);
			} else {
				logger.info('copied style ' + style.source.cyan + ' -> ' + style.destination.cyan);
			}
		});
	}
};
