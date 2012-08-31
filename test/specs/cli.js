var exec = require('child_process').exec;

describe('when the CLI receives no arguments', function() {
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
			//ensure usage data and some known options are displayed
			expect(output).toContain('Usage:');
			expect(output).toContain('-h');
			expect(output).toContain('--force');
		});
	});
});