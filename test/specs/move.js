var path = require('path'),
	exec = require('child_process').exec,
	TU = require('../lib/testUtils');

var alloyRoot = path.join(__dirname,'..','..');
var templatePath = path.join(alloyRoot,'Alloy','template');
var Harness = path.join(alloyRoot,'test','projects','Harness');

describe('alloy move', function() {
	TU.addMatchers();

	it('exits with error, shows help', function() {
		TU.asyncExecTest('alloy move', {
			test: function() {
				expect(this.output.error).not.toBeNull();
			}
		});
	});

	it('exits with error when given an invalid source', function() {
		TU.asyncExecTest('alloy move invalidSource', {
			test: function() {
				expect(this.output.error).not.toBeNull();
			}
		});
	});

	it('exits with error when given an invalid source and destination', function() {
		TU.asyncExecTest('alloy move invalidSource invalidDestination', {
			test: function() {
				expect(this.output.error).not.toBeNull();
			}
		});
	});

	var destinationName = 'testDestination';

	it('move without error', function() {
		TU.asyncExecTest('alloy move index ' + destinationName + ' --project-dir "' + Harness + '"', {reset:true});
	});

	it('ends in error when does not exists source file', function() {
		TU.asyncExecTest('alloy move doesNotExistsSource ' + destinationName + ' --project-dir "' + Harness + '"', {
			test: function() {
				expect(this.output.error).toBeTruthy();
			}
		});
	});

	it('ends in error when exists destination file', function() {
		TU.asyncExecTest('alloy move index ' + destinationName + ' --project-dir "' + Harness + '"', {
			test: function() {
				expect(this.output.error).toBeTruthy();
			}
		});
	});

	it('move without error when exists destination file force options', function() {
		TU.asyncExecTest('alloy move index ' + destinationName + ' --project-dir "' + Harness + '" --force', {reset:true});
	});

	var recursiveDestinationName = 'recursive/testDestination';

	it('recursive move without error', function() {
		TU.asyncExecTest('alloy move index ' + recursiveDestinationName + ' --project-dir "' + Harness + '"', {reset:true});
	});
});
