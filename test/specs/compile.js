var fs = require('fs'),
	path = require('path'),
	wrench = require('wrench'),
	TU = require('../lib/testUtils'),
	CONST = require('../../Alloy/common/constants'),
	_ = require('../../Alloy/lib/alloy/underscore')._;
	
var TIMEOUT_COMPILE = 10000;

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
			it('preparing test app "' + file + '"', function() {
				TU.asyncExecTest('jake app:setup dir=' + file + ' quiet=1');
			});

			_.each(CONST.PLATFORMS, function(platform) {
				it('compiles "' + file + '" test app for platform [' + platform + ']', function() {
					TU.asyncExecTest('alloy compile ' + paths.harness + ' --config platform=' + platform, {
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
