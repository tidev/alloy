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
describe('alloy compile', function() {
	// Iterate through each test app and make sure it compiles for all platforms
	_.each(wrench.readdirSyncRecursive(paths.apps), function(file) {
		var indexXml = path.join(paths.apps,file,'views','index.xml');
		if (path.existsSync(indexXml)) {
			_.each(PLATFORMS, function(platform) {
				it('compiles "' + file + '" test app for platform [' + platform + ']', function() {
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
