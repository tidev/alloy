/**
 * Alloy
 * Copyright (c) 2012 by Appcelerator, Inc. All Rights Reserved.
 * See LICENSE for more information on licensing.
 */

exports.cliVersion = '>=3.X';

exports.init = function (logger, config, cli, appc) {

	var path = require('path'),
		afs = appc.fs,
		i18n = appc.i18n(__dirname),
		__ = i18n.__,
		__n = i18n.__n,
		pkginfo = appc.pkginfo.package(module);
	
	cli.addHook('build.pre.compile', function (build, finished) {
		var appDir = path.join(cli.argv['project-dir'], 'app'),
			origLimit = Error.stackTraceLimit;
		
		Error.stackTraceLimit = Infinity;
		
		if (afs.exists(appDir)) {
			try {
				logger.info(__('Found Alloy app in %s', appDir));
				
				var compiler = require(afs.resolvePath(__dirname, '..', 'Alloy', 'commands', 'compile', 'index.js')),
					config = {
						platform: cli.argv.platform,
						version: '0',
						simtype: 'none',
						devicefamily: /iphone|ios/.test(cli.argv.platform) ? build.deviceFamily : 'none',
						deploytype: build.deployType || cli.argv['deploy-type'] || 'development'
					};
			
				compiler({ /* no args */ }, {
					/* program object */
					config: Object.keys(config).map(function (c) {
							return c + '=' + config[c];
						}).join(','),
					outputPath: cli.argv['project-dir'],
					_version: pkginfo.version,
				});
			} catch (e) {
				logger.error(__('Alloy compiler failed'));
				e.toString().split('\n').forEach(function (line) {
					line && logger.error(line);
				});
			}
		} else {
			logger.info(__('Project not an Alloy app, continuing'));
		}
		
		Error.stackTraceLimit = origLimit;
		finished();
	});
	
};
