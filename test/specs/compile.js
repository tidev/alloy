var fs = require('fs'),
	path = require('path'),
	wrench = require('wrench'),
	TU = require('../lib/testUtils'),
	_ = require('../../Alloy/lib/alloy/underscore')._;
	
var PLATFORMS = process.platform === 'darwin' ? ['android','ios','mobileweb'] : ['android','mobileweb'],
	TIMEOUT_COMPILE = 10000,
	TIMEOUT_DEFAULT = 750;

var alloyRoot = path.join(__dirname,'..','..'),
	paths = {
		apps: path.join(alloyRoot,'test','apps'),
		harness: path.join(alloyRoot,'test','projects','Harness') 
	};

// The alloy command test suite
describe('alloy command', function() {
	it('is available from the command line ala `alloy --version`', function() {
		TU.asyncExecTest('alloy --version', {
			test: function() {
				var o = this.output;

				// Make sure we have no errors
				expect(o.error).toBeFalsy();

				// Make sure we get a valid version number
				expect(/\d+\.\d+\.\d+(?:\-\d+){0,1}/.test(o.stdout)).toBe(true);
			}
		});
	});

	// Iterate through each test app and make sure it compiles for all platforms
	_.each(wrench.readdirSyncRecursive(paths.apps), function(file) {
		var indexXml = path.join(paths.apps,file,'views','index.xml');
		if (path.existsSync(indexXml)) {
			_.each(PLATFORMS, function(platform) {
				it('can compile "' + file + '" test app for platform "' + platform + '"', function() {
					var cmds = [
						'jake app:setup dir=' + file + ' quiet=1',
						'alloy compile ' + paths.harness + ' --config platform=' + platform
					];
					TU.asyncExecTest(cmds.join(' && '), {
						test: function() {
							var o = this.output;

							// Make sure there were no compile errors
							expect(o.error).toBeFalsy();
						},
						timeout: TIMEOUT_COMPILE
					});
				});
			});
		}
	});
});
