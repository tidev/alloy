/**
 * Alloy
 * Copyright (c) 2012 by Appcelerator, Inc. All Rights Reserved.
 * See LICENSE for more information on licensing.
 */

exports.cliVersion = '>=3.X';
var SILENT = true;

exports.init = function (logger, config, cli, appc) {
	var path = require('path'),
		fs = require('fs'),
		afs = appc.fs,
		i18n = appc.i18n(__dirname),
		__ = i18n.__,
		__n = i18n.__n,
		pkginfo = appc.pkginfo.package(module),
		exec = require('child_process').exec,
		spawn = require('child_process').spawn,
		parallel = appc.async.parallel;

		if(!process.env.sdk) {
			process.env.sdk = cli.sdk.name;
		}

	function run(deviceFamily, deployType, target, finished, silent) {
		var appDir = path.join(cli.argv['project-dir'], 'app');
		if (!afs.exists(appDir)) {
			logger.info(__('Project not an Alloy app, continuing'));
			finished();
			return;
		}
		logger.info(__('Found Alloy app in %s', appDir.cyan));

		// TODO: Make this check specific to a TiSDK version
		// create a .alloynewcli file to tell old plugins not to run
		var buildDir = path.join(cli.argv['project-dir'], 'build');
		if (!afs.exists(buildDir)) {
			fs.mkdirSync(buildDir);
		}
		fs.writeFileSync(path.join(buildDir, '.alloynewcli'), '');

		var cRequire = afs.resolvePath(__dirname, '..', 'Alloy', 'commands', 'compile', 'index.js'),
			config = {
				platform: /(?:iphone|ipad)/.test(cli.argv.platform) ? 'ios' : cli.argv.platform,
				version: '0',
				simtype: 'none',
				devicefamily: /(?:iphone|ios)/.test(cli.argv.platform) ? deviceFamily : 'none',
				deploytype: deployType || cli.argv['deploy-type'] || 'development',
				target: target
			};
		if(silent) {
			// turn off all logging output for code analyzer build hook
			config.noBanner = 'true';
			config.logLevel = '-1';
		}

		config = Object.keys(config).map(function (c) {
			return c + '=' + config[c];
		}).join(',');

		if (afs.exists(cRequire)) {
			// we're being invoked from the actual alloy directory!
			// no need to subprocess, just require() and run
			var origLimit = Error.stackTraceLimit;
			Error.stackTraceLimit = Infinity;
			try {
				require(cRequire)({}, {
					config: config,
					outputPath: cli.argv['project-dir'],
					_version: pkginfo.version
				});
			} catch (e) {
				logger.error(__('Alloy compiler failed'));
				e.toString().split('\n').forEach(function (line) {
					if (line) { logger.error(line); }
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
					var envName = 'ALLOY_' + (bin === 'node' ? 'NODE_' : '') + 'PATH';

					paths[bin] = process.env[envName];
					if (paths[bin]) {
						done();
					} else if (process.platform === 'win32') {
						paths.alloy = 'alloy.cmd';
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
									path.join(process.env.HOME, 'local/bin', bin),
									'/opt/bin/' + bin,
									'/usr/bin/' + bin
								].map(function (p) {
									return function (cb) {
										if (afs.exists(p)) { paths[bin] = p; }
										cb();
									};
								}), done);
							}
						});
					}
				};
			}), function () {
				var cmd = [paths.node, paths.alloy, 'compile', appDir, '--config', config];
				if (cli.argv['no-colors'] || cli.argv['color'] === false) { cmd.push('--no-colors'); }
				if (process.platform === 'win32') { cmd.shift(); }
				logger.info(__('Executing Alloy compile: %s', cmd.join(' ').cyan));

				var child = (process.platform === 'win32') ? spawn(cmd.shift(), cmd, { stdio: 'inherit' }) : spawn(cmd.shift(), cmd);

				function checkLine(line) {
					var re = new RegExp(
						'(?:\u001b\\[\\d+m)?\\[?(' +
						logger.getLevels().join('|') +
						')\\]?\s*(?:\u001b\\[\\d+m)?(.*)', 'i'
					);
					if (line) {
						var m = line.match(re);
						if (m) {
							logger[m[1].toLowerCase()](m[2].trim());
						} else {
							logger.debug(line);
						}
					}
				}

				child.stdout !== null && child.stdout.on('data', function (data) {
					data.toString().split('\n').forEach(function (line) {
						checkLine(line);
					});
				});
				child.stderr !== null && child.stderr.on('data', function (data) {
					data.toString().split('\n').forEach(function (line) {
						checkLine(line);
					});
				});
				child !== null && child.on('exit', function (code) {
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
		// TODO: Remove this workaround when the CLI reports the right deploy type for android
		var deployType = build.deployType;
		var target = build.target;

		if (cli.argv.platform === 'android') {
			switch(target) {
				case 'dist-playstore':
					deployType = 'production';
					break;
				case 'device':
					deployType = 'test';
					break;
				case 'emulator':
				default:
					deployType = 'development';
					break;
			}
		}
		run(build.deviceFamily, deployType, target, finished);
	});

	cli.addHook('codeprocessor.pre.run', function (build, finished) {
		run('none', 'development', undefined, finished, SILENT);
	});
};
