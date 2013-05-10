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
		pkginfo = appc.pkginfo.package(module),
		exec = require('child_process').exec,
		spawn = require('child_process').spawn,
		parallel = appc.async.parallel;

	function run(deviceFamily, deployType, finished) {
		var appDir = path.join(cli.argv['project-dir'], 'app');
		if (!afs.exists(appDir)) {
			logger.info(__('Project not an Alloy app, continuing'));
			finished();
			return;
		}

		logger.info(__('Found Alloy app in %s', appDir.cyan));
		var compilerCommand = afs.resolvePath(__dirname, '..', 'Alloy', 'commands', 'compile', 'index.js'),
			config = {
				platform: /(?:iphone|ipad)/.test(cli.argv.platform) ? 'ios' : cli.argv.platform,
				version: '0',
				simtype: 'none',
				devicefamily: /(?:iphone|ios)/.test(cli.argv.platform) ? deviceFamily : 'none',
				deploytype: deployType || cli.argv['deploy-type'] || 'development'
			};

		config = Object.keys(config).map(function (c) {
			return c + '=' + config[c];
		}).join(',');

		if (afs.exists(compilerCommand)) {
			// we're being invoked from the actual alloy directory!
			// no need to subprocess, just require() and run
			var origLimit = Error.stackTraceLimit;
			Error.stackTraceLimit = Infinity;
			try {
				require(compilerCommand)({}, {
					config: config,
					outputPath: cli.argv['project-dir'],
					_version: pkginfo.version,
				});
			} catch (e) {
				logger.error(__('Alloy compiler failed'));
				e.toString().split('\n').forEach(function (line) {
					line && logger.error(line);
				});
				process.exit(1);
			}
			Error.stackTraceLimit = origLimit;
			finished();
		} else {
			// we have no clue where alloy is installed, so we're going to subprocess
			// alloy and hope it's in the system path or a well known place
			var paths = {};
			parallel(this, ['alloy', 'node'].map(function (bin) {
				return function (done) {
					var envName = 'ALLOY_' + (bin == 'node' ? 'NODE_' : '') + 'PATH';
					if (paths[bin] = process.env[envName]) {
						done();
					} else if (process.platform == 'win32') {
						paths['alloy'] = 'alloy.cmd';
						done();
					} else {
						exec('which ' + bin, function (err, stdout, strerr) {
							if (!err) {
								paths[bin] = stdout.trim();
								done();
							} else {
								parallel(this, [
									'/usr/local/bin/' + bin,
									'/opt/local/bin/' + bin,
									path.join(process.env['HOME'], 'local/bin', bin),
									'/opt/bin/' + bin,
									'/usr/bin/' + bin
								].map(function (p) {
									return function (cb) {
										afs.exists(p) && (paths[bin] = p);
										cb();
									};
								}), done);
							}
						});
					}
				};
			}), function () {
				var cmd = [paths.node, paths.alloy, 'compile', appDir, '--config', config];
				cli.argv['no-colors'] && cmd.push('--no-colors');
				process.platform == 'win32' && cmd.shift();
				logger.info(__('Executing Alloy compile: %s', cmd.join(' ').cyan));

				var child = spawn(cmd.shift(), cmd),
					// this regex is used to strip [INFO] and friends from alloy's output and re-log it using our logger
					re = new RegExp('(\u001b\\[\\d+m)?\\[?(' + logger.getLevels().join('|') + ')\\]?\s*(\u001b\\[\\d+m)?(.*)', 'i');
				child.stdout.on('data', function (data) {
					data.toString().split('\n').forEach(function (line) {
						if (line) {
							var m = line.match(re);
							if (m) {
								logger[m[2].toLowerCase()](m[4].trim());
							} else {
								logger.debug(line);
							}
						}
					});
				});
				child.stderr.on('data', function (data) {
					data.toString().split('\n').forEach(function (line) {
						line && logger.error(line);
					});
				});
				child.on('exit', function (code) {
					if (code) {
						logger.error(__('Alloy compiler failed'));
						process.exit(1);
					} else {
						logger.info(__('Alloy compiler completed successfully'));
					}
					finished();
				});
			});
		}
	}

	cli.addHook('build.pre.compile', function (build, finished) {
		run(build.deviceFamily, build.deployType, finished);
	});

	cli.addHook('codeprocessor.pre.run', function (build, finished) {
		run('none', 'development', finished);
	});
};
