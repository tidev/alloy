var basePath = '../../';
var path = require('path'),
	fs = require('fs-extra'),
	xml2tss = require('xml2tss'),
	alloyRoot = path.join(__dirname, '..', '..'),
	_ = require('lodash'),
	U = require(basePath + 'utils'),
	CONST = require(basePath + 'common/constants'),
	logger = require(basePath + 'logger');

function pad(x) {
	if (x < 10) {
		return '0' + x;
	}
	return x;
}

exports.generateMigrationFileName = function(t) {
	var d = new Date();
	var s = String(d.getUTCFullYear()) + String(pad(d.getUTCMonth() + 1)) +
		String(pad(d.getUTCDate())) + String(pad(d.getUTCHours())) +
		String(pad(d.getUTCMinutes())) + String(d.getUTCMilliseconds());
	return s + '_' + t;
};

exports.generate = function(name, type, program, args) {
	args = args || {};
	var ext = '.' + CONST.FILE_EXT[type];
	var paths = U.getAndValidateProjectPaths(program.outputPath, {command : CONST.COMMANDS.GENERATE});
	var templatePath = path.join(alloyRoot, 'template', type.toLowerCase() + ext);
	// ALOY-372 - Support 'alloy generate' command for widget components
	var widgetPath = (program.widgetname) ? CONST.DIR['WIDGET'] + path.sep + program.widgetname : '';
	if (widgetPath && !fs.existsSync(path.join(paths.app, widgetPath))) {
		U.die('No widget named ' + program.widgetname + ' in this project.');
	}
	var dir = path.join(paths.app, widgetPath, CONST.DIR[type]);

	// add the platform-specific folder to the path, if necessary
	if (program.platform) {
		if (_.includes(['VIEW', 'CONTROLLER', 'STYLE'], type)) {
			dir = path.join(dir, program.platform);
		} else {
			logger.warn('platform "' + program.platform +
				'" ignored, not used with type "' + type + '"');
		}
	}

	// get the final file name
	var file = path.join(dir, name + ext);
	var viewFile = path.join(paths.app, CONST.DIR['VIEW'], name + '.' +
		CONST.FILE_EXT['VIEW']);

	// see if the file already exists
	if (fs.existsSync(file) && !program.force &&
		!(type === 'STYLE' && fs.existsSync(viewFile))) {
		U.die(' file already exists: ' + file);
	}

	// make sure the target folder exists
	var fullDir = path.dirname(file);
	if (!fs.existsSync(fullDir)) {
		fs.mkdirpSync(fullDir);
	}

	// only use xml2tss to generate style if the partner view exists
	if (type === 'STYLE' && fs.existsSync(viewFile)) {
		xml2tss.updateFile(viewFile, file, function(err, ok) {
			if (ok) {
				logger.info('Generated style named ' + name);
			} else {
				logger.warn('Style named ' + name + ' already up-to-date');
			}
		});
	} else {
		// write the file out based on the given template
		var templateContents = fs.readFileSync(templatePath, 'utf8');
		if (args.templateFunc) {
			templateContents = args.templateFunc(templateContents);
		}
		var code = _.template(templateContents)(args.template || {});
		fs.writeFileSync(file, code);

		return {
			file: file,
			dir: fullDir,
			code: code
		};
	}
};
