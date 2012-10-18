var fs = require('fs'),
	path = require('path'),
	wrench = require('wrench'),
	exec = require('child_process').exec,
	_ = require('../../Alloy/lib/alloy/underscore')._;
	


var PLATFORMS = process.platform === 'darwin' ? ['android','ios','mobileweb'] : ['android','mobileweb'],
	TIMEOUT_COMPILE = 10000,
	TIMEOUT_DEFAULT = 750;

var alloyRoot = path.join(__dirname,'..','..'),
	paths = {
		apps: path.join(alloyRoot,'test','apps'),
		harness: path.join(alloyRoot,'test','projects','Harness') 
	};
	
// Turns the arguments given to the callback of the exec() function
// into an object literal. 
//
// Params: 
// * args: The "arguments" object from the callback of an exec() call
//
// Return: An object literal with the error, stdout, and stderr 
function getExecObject(args) {
	args = Array.prototype.slice.call(args, 0);
	return {
		error: args[0],
		stdout: args[1],
		stderr: args[2]
	};
}

// Convenience function for handling asynchronous tests that rely on the
// exec() function. The output values from the first runs() block will
// be available as this.output in the second runs() block where the 
// actual tests are evaluated.
//
// Params:
// * cmd:     The command to run through exec()
// * timeout: How long to wait for the command to execute before declaring 
//            the test failed
// * testFn:  The actual test function to execute on output returned from exec()
//
// Return: none
function asyncExecTest(cmd, timeout, testFn) {
	//console.log(cmd);
	runs(function() {
		var self = this;
		self.done = false;
		exec(cmd, function() {
			self.done = true;
			self.output = getExecObject(arguments);
		});
	});
	waitsFor(
		function() { return this.done; }, 
		'exec("' + cmd + '") timed out', timeout || TIMEOUT_DEFAULT
	);
	runs(testFn);
}

// The alloy command test suite
describe('alloy command', function() {
	it('is available from the command line ala `alloy --version`', function() {
		asyncExecTest('alloy --version', 500, function() {
			var o = this.output;

			// Make sure we have no errors
			expect(o.error).toBeFalsy();

			// Make sure we get a valid version number
			expect(/\d+\.\d+\.\d+(?:\-\d+){0,1}/.test(o.stdout)).toBe(true);
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
					asyncExecTest(cmds.join(' && '), TIMEOUT_COMPILE, function() {
						var o = this.output;

						// Make sure there were no compile errors
						expect(o.error).toBeFalsy();
					});
				});
			});
		}
	});
});
