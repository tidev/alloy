var basePath = '../../';
var path = require('path'),
	fs = require('fs'),
	wrench = require('wrench'),
	alloyRoot = path.join(__dirname,'..','..'),
	_ = require(basePath + 'lib/alloy/underscore')._,
	U = require(basePath + 'utils'),
	CONST = require(basePath + 'common/constants'),
	logger = require(basePath + 'common/logger');

function pad(x) {
	if (x < 10) {
		return '0' + x;
	}
	return x;
}

exports.generateMigrationFileName = function(t) {
	var d = new Date;
	var s = String(d.getUTCFullYear()) + String(pad(d.getUTCMonth())) + String(pad(d.getUTCDate())) + String(pad(d.getUTCHours())) + String(pad(d.getUTCMinutes())) + String(d.getUTCMilliseconds())
	return s + '_' + t + '.' + CONST.FILE_EXT.MIGRATION;
}

exports.generate = function(name, type, program, args) {
	args = args || {};
	var ext = '.'+CONST.FILE_EXT[type];
	var paths = U.getAndValidateProjectPaths(program.outputPath);
	var templatePath = path.join(alloyRoot,'template',type.toLowerCase()+ext);
	
	var dir = path.join(paths.app,CONST.DIR[type]);
	if (program.platform) {
		if (_.contains(['VIEW','CONTROLLER','STYLE'],type)) {
			dir = path.join(dir,program.platform);
		} else {
			logger.warn('platform "' + program.platform + '" ignored, not used with type "' + type + '"');
		}
	}
	var file = path.join(dir,path.basename(name,ext)+ext);

	if (path.existsSync(file) && !program.force) {
		U.die(" file already exists: " + file);
	}
	if (!path.existsSync(dir)) {
		wrench.mkdirSyncRecursive(dir);
	}

	var templateContents = fs.readFileSync(templatePath,'utf8');
	if (args.templateFunc) { templateContents = args.templateFunc(templateContents); }
	var code = _.template(templateContents, args.template || {});
	fs.writeFileSync(file, code);

	return {
		file: file,
		dir: dir,
		code: code
	};
}