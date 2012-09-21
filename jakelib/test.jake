var fs = require('fs'),
	path = require('path'),
	jlib = require('../test/lib/jasmine'),
	ConsoleReporter = require('../test/lib/ConsoleReporter'),
	_ = require('../Alloy/lib/alloy/underscore');

path.existsSync = fs.existsSync || path.existsSync;

//globalize the Jasmine functions
_.extend(global, jlib);

//Set up Jasmine to print to the console with our custom printer
jasmine.getEnv().addReporter(new ConsoleReporter(console.log, function() {}, true));

//run list of specs
function runSpecs(names) {
	_.each(names, function(name) {
		require('../test/specs/'+name);
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
		runSpecs(fs.readdirSync(path.join(process.cwd(), 'test', 'specs')));		
	});
});
