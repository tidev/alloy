var fs = require('fs'),
	path = require('path'),
	TU = require('../lib/testUtils'),
	U = require('../../Alloy/utils'),
	CONST = require('../../Alloy/common/constants'),
	_ = require('../../Alloy/lib/alloy/underscore')._;

var TIMEOUT_DEFAULT = 1000;

// The alloy command test suite
describe('alloy', function() {
	it('can be executed', function() {
		TU.asyncExecTest('alloy');
	});

	it('displays help when it receives no arguments', function() {
		TU.asyncExecTest('alloy', {
			test: function() {
				expect(U.stripColors(this.output.stdout)).toMatch(
					/Usage\:\s+alloy\s+COMMAND\s+\[ARGS\]\s+\[OPTIONS\]/);
			}
		});
	});

	it('fails when given an invalid command name', function() {
		TU.asyncExecTest('alloy invalidCommand', {
			test: function() {
				expect(this.output.error).toBeTruthy();
			}
		});
	});

	it('--version returns the current version', function() {
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
});