/**
 * Alloy
 * Copyright (c) 2012 by Appcelerator, Inc. All Rights Reserved.
 * See LICENSE for more information on licensing.
 */

exports.cliVersion = '>=3.X';

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

	var CONST = {
		I18N: 'i18n',
		I18N_ORIG: "i18n_original",
		I18N_TMP: "i18n_tmp"
	};

	function run(deviceFamily, deployType, target, finished) {
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
				if (cli.argv['no-colors']) { cmd.push('--no-colors'); }
				if (process.platform === 'win32') { cmd.shift(); }
				logger.info(__('Executing Alloy compile: %s', cmd.join(' ').cyan));

				var child = spawn(cmd.shift(), cmd);

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

				child.stdout.on('data', function (data) {
					data.toString().split('\n').forEach(function (line) {
						checkLine(line);
					});
				});
				child.stderr.on('data', function (data) {
					data.toString().split('\n').forEach(function (line) {
						checkLine(line);
					});
				});
				child.on('exit', function (code) {
					if (code) {
						logger.error(__('Alloy compiler failed'));
						removeDir(path.join(cli.argv["project-dir"], CONST.I18N_TMP));
						process.exit(1);
					} else {
						logger.info(__('Alloy compiler completed successfully'));
						swapFolderNames(
							path.join(cli.argv["project-dir"], CONST.I18N_TMP),
							path.join(cli.argv["project-dir"], CONST.I18N),
							{"extra" : "_original"}
						);
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
		run('none', 'development', undefined, finished);
	});

	function removeDir(target) {
		if (fs.existsSync(target)) {
			fs.readdirSync(target).forEach(function(file,index) {
				var curr = target + "/" + file;
				if (fs.lstatSync(curr).isDirectory()) {
					removeDir(curr);
				} else {
					fs.unlinkSync(curr);
				}
			});
			fs.rmdirSync(target);
		}
	}

	function swapFolderNames(fromDir, toDir, opt) {
		if (!afs.exists(toDir) && afs.exists(fromDir)) {
			fs.renameSync(fromDir, toDir);
			fs.mkdirSync(fromDir); //for post compile clean up
		} else if (afs.exists(toDir) && afs.exists(fromDir)) {
			fs.renameSync(toDir, toDir+opt.extra); //rename original folder temporarily
			fs.renameSync(fromDir, toDir); //rename merged folder
		}
	}

	cli.addHook('build.post.compile', function (build, finished) {
		var i18nOrigDir = path.join(cli.argv["project-dir"], CONST.I18N_ORIG),
			i18nNewDir = path.join(cli.argv["project-dir"], CONST.I18N),
			i18nTempDir = path.join(cli.argv["project-dir"], CONST.I18N_TMP);

		if (afs.exists(i18nOrigDir)) {
			if (afs.exists(i18nNewDir)) {
				removeDir(i18nNewDir);
			}
			fs.renameSync(i18nOrigDir, i18nNewDir);
		} else {
			if (afs.exists(i18nTempDir) && afs.exists(i18nNewDir)) {
				removeDir(i18nTempDir);
				removeDir(i18nNewDir);
			}
		}

		finished();
	});
};
