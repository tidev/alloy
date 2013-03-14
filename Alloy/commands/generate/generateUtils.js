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

function mkdirP (p, mode, f, made) {
    if (typeof mode === 'function' || mode === undefined) {
        f = mode;
        mode = 0777 & (~process.umask());
    }
    if (!made) made = null;

    var cb = f || function () {};
    if (typeof mode === 'string') mode = parseInt(mode, 8);
    p = path.resolve(p);

    fs.mkdir(p, mode, function (er) {
        if (!er) {
            made = made || p;
            return cb(null, made);
        }
        switch (er.code) {
            case 'ENOENT':
                mkdirP(path.dirname(p), mode, function (er, made) {
                    if (er) cb(er, made);
                    else mkdirP(p, mode, cb, made);
                });
                break;

            // In the case of any other error, just see if there's a dir
            // there already.  If so, then hooray!  If not, then something
            // is borked.
            default:
                fs.stat(p, function (er2, stat) {
                    // if the stat fails, then that's super weird.
                    // let the original error be the failure reason.
                    if (er2 || !stat.isDirectory()) cb(er, made)
                    else cb(null, made);
                });
                break;
        }
    });
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

 	if (path.dirname(name).length > 1) {
    		mkdirP(path.join(dir, path.dirname(name)));
  	} 

	var file = path.join(dir,name+ext);

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
