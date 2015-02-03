var fs = require('fs'),
	path = require('path'),
	os = require('os'),
	wrench = require('wrench'),
	colors = require('colors'),
	exec = require('child_process').exec,
	TU = require('../lib/testUtils'),
	CONST = require('../../Alloy/common/constants'),
	_ = require('../../Alloy/lib/alloy/underscore')._,
	tiapp = require('../../Alloy/tiapp'),
	platforms = require('../../platforms/index'),
	sep = process.platform !== 'win32' ? '/' : '\\';

var TIMEOUT_COMPILE = process.platform !== 'win32' ? 10000 : 20000;
var TIMEOUT_PREP = process.platform !== 'win32' ? 10000 : 30000;
var GEN_FOLDER = '_generated';
var TEST_FOLDER = 'testing';
var EXCLUDE_FOLDERS = [
	'ui'+sep+'navwindow',
	TEST_FOLDER+sep+'ALOY-818',
	TEST_FOLDER+sep+'ALOY-840',
	TEST_FOLDER+sep+'ALOY-1080',
	TEST_FOLDER+sep+'ALOY-932',
	TEST_FOLDER+sep+'ALOY-961'
];

/*
// async, so it doesn't complete by the time the tests begin.
// once ALOY-1230 is resolved, rewrite using beforeAll()

// Skip the test that depends on version of SDKs
exec('ti sdk list --output json', function(error, stdout, stderr){
    if (error === null) {
        var sdkInfo = JSON.parse(stdout);

        if (tiapp.version.lt(sdkInfo.activeSDK, '3.6.0') || !sdkInfo) {
        	// Skip ALOY-961 / AttributedString when using pre-3.6.0 SDKs
            EXCLUDE_FOLDERS.push(TEST_FOLDER+sep+'ALOY-961');
        }
    }
});
*/

var alloyRoot = path.join(__dirname,'..','..'),
	paths = {
		apps: path.join(alloyRoot,'test','apps'),
		harness: path.join(alloyRoot,'test','projects','Harness')
	},
	compilerDirectives = (function() {
		var cds = [];
		_.each(_.keys(platforms), function(p) {
			cds.push('OS_' + p.toUpperCase());
		});
		cds.concat(_.pluck(CONST.DEPLOY_TYPES,'key'));
		return cds;
	})(),
	cdRegex = new RegExp('(?:' + compilerDirectives.join('|') + ')');

// The alloy command test suite
describe('alloy compile', function() {
	TU.addMatchers();

	// Iterate through each test app and make sure it compiles for all platforms
	_.each(wrench.readdirSyncRecursive(paths.apps), function(file) {
		// are we testing only a specific app?
		if (process.env.app && file !== process.env.app) { return; }

		// TODO: Stop skipping the ui/navwindow test when TiSDK 3.1.3 is in the HarnessTemplate
		//       tiapp.xml. We skip it now because it purposely fails compilation on any SDK below
		//       TiSDK 3.1.3, where Ti.UI.iOS.NavigationWindow was introduced.
		if (_.contains(EXCLUDE_FOLDERS, file)) { return; }

		describe(file.yellow, function() {
			var indexJs = path.join(paths.apps,file,'controllers','index.js');
			if (!path.existsSync(indexJs) || indexJs.indexOf(GEN_FOLDER) !== -1) { return; }

			it('preparing test app', function() {
				TU.asyncExecTest('jake app:setup dir=' + file + ' quiet=1', { timeout: TIMEOUT_PREP });
			});

			_.each(platforms, function(platform,k) {
				if (process.platform !== 'win32' && platform.platform === 'blackberry') {
					return;
				}
				if(process.platform !== 'win32' && platform.platform === 'windows') {
					// skip windows tests on non-Windows computers
					return;
				}

				describe(('[' + platform.platform + ']').cyan, function () {
						it('compiles without critical error',
						function() {
							TU.asyncExecTest(
								'alloy compile ' + paths.harness + ' --config platform=' + platform.platform, {
								test: function() {
									// Make sure there were no compile errors
									if (file === 'testing'+sep+'ALOY-887') {
										// this test specifically tests a compiler error
										expect(this.output.error).toBeTruthy();
									} else {
										expect(this.output.error).toBeFalsy();
									}
								},
								timeout: TIMEOUT_COMPILE
							}
						);
					});

					it('leaves no compiler directives in generated code', function() {
						var hrDir = path.join(paths.harness,'Resources');
						var cPaths = [
							path.join(hrDir,'alloy'),
							path.join(hrDir,platform.titaniumFolder,'alloy')
						];

						_.each(cPaths, function(cPath) {
							if (file === 'testing'+sep+'ALOY-887') {
								// skip this test since this app forces a compile error
								return;
							}
							if (!fs.existsSync(cPath)) { return; }
							var files = wrench.readdirSyncRecursive(cPath);
							_.each(files, function(file) {
								var fullpath = path.join(cPath,file);
								if (!fs.statSync(fullpath).isFile() ||
									!/\.js$/.test(fullpath)) {
									return;
								}
								var content = fs.readFileSync(fullpath, 'utf8');
								expect(cdRegex.test(content)).toBeFalsy();
							});
						});
					});

					it('has no undefined style entries', function() {
						// skip this test, since it specifically tests undefined values in TSS
						if (file === 'testing'+sep+'ALOY-822') {
							return;
						}

						var hrDir = path.join(paths.harness,'Resources');
						var cPaths = [
							path.join(hrDir,'alloy','styles'),
							path.join(hrDir,platform.titaniumFolder,'alloy','styles')
						];

						_.each(cPaths, function(cPath) {
							if (!fs.existsSync(cPath)) { return; }
							var files = wrench.readdirSyncRecursive(cPath);
							_.each(files, function(file) {
								var fullpath = path.join(cPath,file);
								if (!fs.statSync(fullpath).isFile() ||
									!/\.js$/.test(fullpath)) {
									return;
								}

								// TODO: Can no longer require() the styles since they
								//       are preprocessed for runtime now. Find a better
								//       way than this lazy text check to verify that
								//       there's no undefined keys in the styles.
								expect(fs.readFileSync(fullpath,'utf8').indexOf('undefined')).toEqual(-1);
								// var json = require(fullpath);
								// expect(json).toHaveNoUndefinedStyles();
							});
						});
					});

					var genFolder = path.join(paths.apps,file,GEN_FOLDER,platform.platform);
					if (!fs.existsSync(genFolder)) { return; }
					var hrFolder = path.join(paths.harness, 'Resources', platform.titaniumFolder);
					var files = wrench.readdirSyncRecursive(genFolder);

					os.platform() === 'darwin' && _.each(files, function(gFile) {
						var goodFile = path.join(genFolder,gFile);
						if (!fs.statSync(goodFile).isFile()) { return; }
						var newFile = path.join(hrFolder,gFile);

						it ('generated a ' + gFile.yellow + ' file', function() {
							expect(fs.existsSync(newFile)).toBeTruthy();
						});

						it('matches known good generated code for ' + gFile.yellow, function () {
							var goodFileContents = fs.readFileSync(goodFile, 'utf8');
							var newFileContents = fs.readFileSync(newFile, 'utf8');

/*						if(goodFileContents !== newFileContents) {
							// Cheat way to re-generate known-good files
							// uncomment this block, run jake test:spec[compile.js]
							// then re-comment this block. jake test:all should now be happy
							console.log('>>>> writing a new goodFile');
							fs.createReadStream(newFile).pipe(fs.createWriteStream(goodFile));
							goodFileContents = fs.readFileSync(goodFile, 'utf8');
						}
*/
							expect(goodFileContents === newFileContents).toBeTruthy();
						});
					});
				});
			});
		});
	});
});
