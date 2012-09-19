var path = require('path'),
	_ = require("../../lib/alloy/underscore")._,
	U = require('../../utils');

var TARGETS = ['controller', 'jmk', 'model', 'migration', 'view', 'widget'];

function generate(args, program) {
	args = args || [];
	program = program || {};

	var target = args[0];	
	var name = args[1];

	// validate arguments
	program.outputPath = program.outputPath || U.resolveAppHome();
	if (!path.existsSync(program.outputPath)) {
		U.die('"' + program.outputPath + '" is not a valid Alloy project path.');
	}
	if (!target) {
		U.die('generate requires a TYPE as second argument: [' + TARGETS.join(',') + ']');
	} 
	if (!name) {
		if (target === 'jmk') {
			name = 'alloy';
		} else {
			U.die('generate requires a NAME such as third argument');
		}
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