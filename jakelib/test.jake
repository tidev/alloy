var fs = require('fs'),
	path = require('path'),
	jlib = require('../test/lib/jasmine'),
	ConsoleReporter = require('../test/lib/ConsoleReporter'),
	_ = require('lodash');

process.env.ALLOY_TESTS = true;
path.existsSync = fs.existsSync || path.existsSync;

//globalize the Jasmine functions
_.extend(global, jlib);

// MUST ADD JUNIT REPORTER FIRST, OR ELSE ANY FAILURES CAUSE
// CONSOLE REPORTER TO CALL process.exit(1) first
require('../test/lib/JunitReporter');
jasmine.getEnv().addReporter(new jasmine.JUnitXmlReporter());

//Set up Jasmine to print to the console with our custom printer
jasmine.getEnv().addReporter(new ConsoleReporter({
	print: console.log,
	showColors: true
}));

//run list of specs
function runSpecs(names) {
	_.each(names, function(name) {
		var fullpath = 'test/specs/' + name;
		if (fs.statSync(fullpath).isDirectory()) {
			fullpath = fullpath + '/index.js';
		}
		console.log('Loading test spec from "' + fullpath + '"');
		require('../' + fullpath);
	});
	jasmine.getEnv().execute();
}

//Set up Jake namespace for testing
namespace('test', function() {
	desc('run a specific Jasmine test spec, by name - e.g. jake test:spec[specName] or jake test:spec[spec1,spec2,spec3]');
	task('spec', function() {
		runSpecs(arguments);
	});

	desc('run all test specs in the spec directory - e.g. jake test:all');
	task('all', function() {
		runSpecs(fs.readdirSync(path.join(process.cwd(), 'test', 'specs')).reverse());
	});
});
