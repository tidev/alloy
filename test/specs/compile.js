var fs = require('fs');
var path = require('path');
var wrench = require('wrench');
var exec = require('child_process').exec;
var _ = require('../../Alloy/lib/alloy/underscore')._;
var alloyRoot = path.join(__dirname,'..','..');

var paths = {
	apps: path.join(alloyRoot,'test','apps')
};

function getExecObject(args) {
	args = Array.prototype.slice.call(args, 0);
	return {
		error: args[0],
		stdout: args[1],
		stderr: args[2]
	};
}

describe('alloy command', function() {
	it('is available from the command line ala `alloy --version`', function() {
		var o = {};
		var done = false;

		runs(function() {
			exec('alloy --version', function() {
				done = true;
				o = getExecObject(arguments);
			});
		});

		waitsFor(function() { return done; }, "exec() timed out", 500);

		runs(function() {
			expect(o.error).toBeFalsy();
			expect(/\d+\.\d+\.\d+(?:\-\d+){0,1}/.test(o.stdout)).toBe(true);
		});
	});

	//wrench.readdirSyncRecursive();
	it('is available from the command line ala `alloy --version`', function() {

	});
});
