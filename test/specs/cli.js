var exec = require('child_process').exec;

describe('when the CLI receives no arguments', function() {
	//TODO: this is shitty default behavior and should be changed to display all commands and help
	it('will prompt the user to specify an action', function() {
		var done, output;
		
		runs(function() {
			exec('alloy', function(err, stdout, stderr) {
				output = stdout;
				done = true;
			});
		});
		
		waitsFor(function() {
			return done;
		},500);
		
		runs(function() {
			console.log(output);
			expect(output).toContain('Alloy by Appcelerator. The MVC app framework for Titanium.');
		});
	});
});

describe('the "run" command in the CLI', function() {
	it('will do something awesome (placeholder)', function() {
		expect(true).toBe(true);
	});
});

describe('the "new" command in the CLI', function() {
	it('will generate a view', function() {
		expect(true).toBe(true);
	});
});

describe('the "compile" command in the CLI', function() {
	it('will do something awesome (placeholder)', function() {
		expect(true).toBe(true);
	});
});