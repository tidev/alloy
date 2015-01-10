var path = require('path'),
	exec = require('child_process').exec,
	TU = require('../lib/testUtils');

var alloyRoot = path.join(__dirname,'..','..');
var templatePath = path.join(alloyRoot,'Alloy','template');
var Harness = path.join(alloyRoot,'test','projects','Harness');

describe('alloy remove', function() {
	TU.addMatchers();

	it('exits with error, shows help', function() {
		TU.asyncExecTest('alloy remove', {
			test: function() {
				expect(this.output.error).not.toBeNull();
			}
		});
	});

	it('exits with error when given an invalid source', function() {
		TU.asyncExecTest('alloy remove invalidSource', {
			test: function() {
				expect(this.output.error).not.toBeNull();
			}
		});
	});

	var sourceName = 'testSource';

	it('remove without error', function() {
		TU.asyncExecTest('alloy copy index ' + sourceName + ' --project-dir "' + Harness + '";' +
			'alloy remove ' + sourceName + ' --project-dir "' + Harness + '"', {reset:true});
	});

	it('ends in error when does not exists source file', function() {
		TU.asyncExecTest('alloy remove doesNotExistsSource --project-dir "' + Harness + '"', {
			test: function() {
				expect(this.output.error).toBeTruthy();
			}
		});
	});

	var recursivesourceName = 'recursive/testsource';

	it('recursive remove without error', function() {
		TU.asyncExecTest('alloy copy index ' + recursivesourceName + ' --project-dir "' + Harness + '";' +
			'alloy remove ' + recursivesourceName + ' --project-dir "' + Harness + '"', {reset:true});
	});
});
