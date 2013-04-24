var fs = require('fs'),
	path = require('path'),
	wrench = require('wrench'),
	TU = require('../lib/testUtils'),
	CONST = require('../../Alloy/common/constants'),
	_ = require('../../Alloy/lib/alloy/underscore')._,
	platforms = require('../../platforms/index');
	
var TIMEOUT_COMPILE = 10000;

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
		var indexXml = path.join(paths.apps,file,'views','index.xml');
		if (path.existsSync(indexXml)) {
			it('preparing test app "' + file + '"', function() {
				TU.asyncExecTest('jake app:setup dir=' + file + ' quiet=1');
			});

			_.each(platforms, function(platform,k) {
				it('compiles "' + file + '" test app for platform [' + platform.platform + ']', 
					function() {
						TU.asyncExecTest(
							'alloy compile ' + paths.harness + ' --config platform=' + platform.platform, {
							test: function() {
								var o = this.output;

								// Make sure there were no compile errors
								expect(o.error).toBeFalsy();
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
			});
		}
	});
});
