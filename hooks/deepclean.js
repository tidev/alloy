/**
 * Alloy
 * Copyright (c) 2014 by Appcelerator, Inc. All Rights Reserved.
 * See LICENSE for more information on licensing.
 */

exports.cliVersion = '>=3.X';
var SILENT = true;

exports.init = function (logger, config, cli, appc) {
	var path = require('path'),
		fs = require('fs'),
		afs = appc.fs;

	function run() {
		if(cli.argv['shallow'] === '') {
			logger.info('Not cleaning the Resources directory')
			return;
		}
		var appDir = path.join(cli.argv['project-dir'], 'app');
		if (!afs.exists(appDir)) {
			logger.debug('Project not an Alloy app, exiting.');
			finished();
			return;
		}

		var resourcesDir = path.join(cli.argv['project-dir'], 'Resources');
		if (!afs.exists(resourcesDir)) {
			logger.debug('Resources directory does not exist.');
			return;
		}
		rmdir(resourcesDir, fs, path, logger);
		logger.debug('Resources directory of %s has been emptied', appDir.cyan);
	}

	cli.addHook('clean.post', function (build, finished) {
		run();
	});

};

function rmdir(dirPath, fs, path, logger, removeSelf) {
	var files;
	try {
		files = fs.readdirSync(dirPath);
	}
	catch(e) {
		return;
	}
	if (files.length > 0) {
		for (var i = 0; i < files.length; i++) {
			var filePath = path.join(dirPath, files[i]);
			if (fs.statSync(filePath).isFile()) {
				fs.unlinkSync(filePath);
			} else {
				rmdir(filePath, fs, path, logger, true);
			}
		}
	}
	if (removeSelf) {
		fs.rmdirSync(dirPath);
	}
}