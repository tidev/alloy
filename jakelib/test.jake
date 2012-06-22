var fs = require('fs'),
	jlib = require('../test/lib/jasmine'),
	ConsoleReporter = require('../test/lib/ConsoleReporter'),
	_ = require('../test/lib/underscore');

//globalize the Jasmine functions
_.extend(global, jlib);

//Set up Jasmine to print to the console with our custom printer
jasmine.getEnv().addReporter(new ConsoleReporter(console.log, function() {}, true));

//run list of specs
function runSpecs(names) {
	_.each(names, function(name) {
		var mod = name.substr(0, name.lastIndexOf('.js')) || name;
		require('../test/specs/'+name);
	});
	jasmine.getEnv().execute();
}

//Set up Jake namespace for testing
namespace('test', function() {
	desc('run a specific Jasmine test spec, by name - e.g. jake test:spec[specName]');
	task('spec', function() {
		runSpecs(arguments);
	});
	
	desc('run all test specs in the spec directory - e.g. jake test:all');
	task('all', function() {
		runSpecs(fs.readdirSync(process.cwd()+'/test/specs'));		
	});
});
