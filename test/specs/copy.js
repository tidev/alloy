var path = require('path'),
	exec = require('child_process').exec,
	TU = require('../lib/testUtils');

var alloyRoot = path.join(__dirname,'..','..');
var templatePath = path.join(alloyRoot,'Alloy','template');
var Harness = path.join(alloyRoot,'test','projects','Harness');

describe('alloy copy', function() {
	TU.addMatchers();

	it('exits with error, shows help', function() {
		TU.asyncExecTest('alloy copy', {
			test: function() {
				expect(this.output.error).not.toBeNull();
			}
		});
	});

	it('exits with error when given an invalid source', function() {
		TU.asyncExecTest('alloy copy invalidSource', {
			test: function() {
				expect(this.output.error).not.toBeNull();
			}
		});
	});

	it('exits with error when given an invalid source and destination', function() {
		TU.asyncExecTest('alloy copy invalidSource invalidDestination', {
			test: function() {
				expect(this.output.error).not.toBeNull();
			}
		});
	});

	var destinationName = 'testDestination';

	it('copy without error', function() {
		TU.asyncExecTest('alloy copy index ' + destinationName + ' --project-dir "' + Harness + '"', {reset:true});
	});

	it('ends in error when does not exists source file', function() {
		TU.asyncExecTest('alloy copy doesNotExistsSource ' + destinationName + ' --project-dir "' + Harness + '"', {
			test: function() {
				expect(this.output.error).toBeTruthy();
			}
		});
	});

	it('ends in error when exists destination file', function() {
		TU.asyncExecTest('alloy copy index ' + destinationName + ' --project-dir "' + Harness + '"', {
			test: function() {
				expect(this.output.error).toBeTruthy();
			}
		});
	});

	it('copy without error when exists destination file force options', function() {
		TU.asyncExecTest('alloy copy index ' + destinationName + ' --project-dir "' + Harness + '" --force', {reset:true});
	});

	var recursiveDestinationName = 'recursive/testDestination';

	it('recursive copy without error', function() {
		TU.asyncExecTest('alloy copy index ' + recursiveDestinationName + ' --project-dir "' + Harness + '"', {reset:true});
	});
});
