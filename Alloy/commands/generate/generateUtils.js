var basePath = '../../';
var path = require('path'),
	fs = require('fs'),
	wrench = require('wrench'),
	xml2tss = require('xml2tss'),
	alloyRoot = path.join(__dirname,'..','..'),
	_ = require(basePath + 'lib/alloy/underscore')._,
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
	var s = String(d.getUTCFullYear()) + String(pad(d.getUTCMonth())) +
		String(pad(d.getUTCDate())) + String(pad(d.getUTCHours())) +
		String(pad(d.getUTCMinutes())) + String(d.getUTCMilliseconds());
	return s + '_' + t;
};

exports.generate = function(name, type, program, args) {
	args = args || {};
	var ext = '.'+CONST.FILE_EXT[type];
	var paths = U.getAndValidateProjectPaths(program.outputPath);
	var templatePath = path.join(alloyRoot,'template',type.toLowerCase()+ext);
	var dir = path.join(paths.app,CONST.DIR[type]);

	// add the platform-specific folder to the path, if necessary
	if (program.platform) {
		if (_.contains(['VIEW','CONTROLLER','STYLE'],type)) {
			dir = path.join(dir,program.platform);
		} else {
			logger.warn('platform "' + program.platform +
				'" ignored, not used with type "' + type + '"');
		}
	}

	// get the final file name
	var file = path.join(dir,name + ext);
	var viewFile = path.join(paths.app, CONST.DIR['VIEW'], name + "." +
		CONST.FILE_EXT['VIEW']);

	// see if the file already exists
	if (fs.existsSync(file) && !program.force &&
		!(type === "STYLE" && fs.existsSync(viewFile))) {
		U.die(" file already exists: " + file);
	}

	// make sure the target folder exists
	var fullDir = path.dirname(file);
	if (!fs.existsSync(fullDir)) {
		wrench.mkdirSyncRecursive(fullDir);
	}

	// only use xml2tss to generate style if the partner view exists
	if (type === "STYLE" && fs.existsSync(viewFile)) {
		xml2tss.updateFile(viewFile, file, function(err,ok) {
			if (ok) {
				logger.info('Generated style named ' + name);
			} else {
				logger.warn('Style named ' + name + ' already up-to-date');
			}
		});
	} else {
		// write the file out based on the given template
		var templateContents = fs.readFileSync(templatePath,'utf8');
		if (args.templateFunc) {
			templateContents = args.templateFunc(templateContents);
		}
		var code = _.template(templateContents, args.template || {});
		fs.writeFileSync(file, code);

		return {
			file: file,
			dir: fullDir,
			code: code
		};
	}
};
