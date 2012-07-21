var _ = require("../../lib/alloy/underscore")._,
	U = require('../../utils');

// TODO: generate TARGETS array by reading the Alloy/commands/generate files
var TARGETS = ['component', 'controller', 'view', 'model', 'migration', 'styles', 'widget'];

function generate(args, program) {
	args = args || [];
	program = program || {};

	var target = args[0];	
	var name = args[1];

	// validate arguments
	program.outputPath = program.outputPath || U.resolveAppHome();
	if (!target) {
		U.die('generate requires a TYPE as second argument: [' + TARGETS.join(',') + ']');
	} 
	if (!name) {
		U.die('generate requires a NAME such as third argument');
	} 
	if (!_.contains(TARGETS, target)) {
		U.die(
			'Invalid generate target "' + target + '"\n' + 
			'Must be one of the following: [' + TARGETS.join(',') + ']'
		);
	}

	// launch requested generator
	(require('./targets/' + target))(name, args.slice(2), program);
}

module.exports = generate;