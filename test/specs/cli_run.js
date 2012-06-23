var fs = require('fs'),
	path = require('path'),
	exists = path.existsSync,
	exec = require('child_process').exec,
	spawn = require('child_process').spawn,
	wrench = require('wrench'),
	titanium = require('../../Alloy/common/titanium');

var harnessAppPath = path.join(process.cwd(),'test', 'projects', 'Harness');

describe('the "run" command in the CLI', function() {
	it('will run an Alloy-powered project in the iPhone simulator on OS X', function() {
		if (process.platform === 'darwin') {
			var done, ran;
			runs(function() {
				console.log(harnessAppPath);
				var p = spawn('alloy',  ['run', harnessAppPath], process.env);
				p.stdout.on('data', function(data) {
					console.log(''+data);
					//counting this log message as confirmation that the simulator has been launched
					if (String(data).indexOf('Launched application in Simulator') > -1) {
						ran = true;
						done = true;
						p.kill();
					}
				});
				p.stderr.on('data', function(data) {
					console.log(''+data);
				});
				p.on('exit', function(code) {
					done = true;
					exec('killall -2 "iPhone Simulator"');
					exec('killall -2 iphonesim');
					exec('killall -2 ios-sim');
				});
			});

			waitsFor(function() {
				return done;
			},120000);

			runs(function() {
				//true if the simulator ran and we got the appropriate Titanium log messages
				expect(ran).toBe(true);
			});
		}
	});
});