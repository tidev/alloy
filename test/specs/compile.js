var fs = require('fs');
var path = require('path');
var exec = require('child_process').exec;

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

	
});


runs(function() {
      flag = false;
      value = 0;

      setTimeout(function() {
        flag = true;
      }, 500);
    });