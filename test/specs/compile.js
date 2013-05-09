var fs = require('fs'),
	path = require('path'),
	wrench = require('wrench'),
	colors = require('colors'),
	TU = require('../lib/testUtils'),
	CONST = require('../../Alloy/common/constants'),
	_ = require('../../Alloy/lib/alloy/underscore')._,
	platforms = require('../../platforms/index');
	
var TIMEOUT_COMPILE = 10000;
var GEN_FOLDER = '_generated';

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
	// Iterate through each test app and make sure it compiles for all platforms
	_.each(wrench.readdirSyncRecursive(paths.apps), function(file) {
		describe(file.yellow, function() {
			var indexJs = path.join(paths.apps,file,'controllers','index.js');
			if (!path.existsSync(indexJs) || indexJs.indexOf(GEN_FOLDER) !== -1) { return; }

			it('preparing test app', function() {
				TU.asyncExecTest('jake app:setup dir=' + file + ' quiet=1');
			});

			_.each(platforms, function(platform,k) {
				describe('for ' + platform.platform.cyan, function () {
					it('compiles without critical error', 
						function() {
							TU.asyncExecTest(
								'alloy compile ' + paths.harness + ' --config platform=' + platform.platform, {
								test: function() {
									// Make sure there were no compile errors
									expect(this.output.error).toBeFalsy();
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

					var genFolder = path.join(paths.apps,file,GEN_FOLDER,platform.platform);
					if (!fs.existsSync(genFolder)) { return; }
					var hrFolder = path.join(paths.harness,'Resources');
					var files = wrench.readdirSyncRecursive(genFolder);

					_.each(files, function(gFile) {
						var goodFile = path.join(genFolder,gFile);
						if (!fs.statSync(goodFile).isFile()) { return; }
						
						it('matches known good generated code for ' + gFile.yellow, function () {
							var newFile = path.join(hrFolder,gFile);
							expect(fs.existsSync(newFile)).toBeTruthy();

							var goodFileContents = fs.readFileSync(goodFile, 'utf8');
							var newFileContents = fs.readFileSync(newFile, 'utf8');
							expect(goodFileContents === newFileContents).toBeTruthy();
						});
					});
				});
			});
		});
	});
});
