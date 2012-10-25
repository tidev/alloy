var fs = require('fs'),
	path = require('path'),
	TU = require('../lib/testUtils'),
	CONST = require('../../Alloy/common/constants'),
	_ = require('../../Alloy/lib/alloy/underscore')._,
	strip = require('stripcolorcodes');

var TIMEOUT_DEFAULT = 1000;

// The alloy command test suite
describe('`alloy`', function() {
	it('can be executed', function() {
		TU.asyncExecTest('alloy');
	});

	it('displays help when it receives no arguments', function() {
		TU.asyncExecTest('alloy', {
			test: function() {
				expect(strip(this.output.stdout)).toMatch(/Usage\:\s+alloy\s+COMMAND\s+\[ARGS\]\s+\[OPTIONS\]/);
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
});