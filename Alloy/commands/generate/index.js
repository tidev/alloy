/*
	Corresponds to the `alloy generate *` command.
	http://docs.appcelerator.com/titanium/latest/#!/guide/Alloy_Tasks_with_the_CLI-section-37536785_AlloyTaskswiththeCLI-GeneratingComponents

	Actual component generators are defined in the targets folder
*/
var path = require('path'),
	_ = require("../../lib/alloy/underscore")._,
	U = require('../../utils'),
	CONST = require('../../common/constants');

function generate(args, program) {
	args = args || [];
	program = program || {};

	var target = args[0];
	var name = args[1];

	// make sure we have a generate target
	if (!target) {
		U.die('generate requires a TYPE as second argument: [' + CONST.GENERATE_TARGETS.join(',') + ']');
	}

	// make sure we have a valid project path
	var paths = U.getAndValidateProjectPaths(
		program.projectDir || program.outputPath || process.cwd(),
		{command : CONST.COMMANDS.GENERATE}
	);
	program.projectDir = program.outputPath = paths.project;

	// grab the name
	if (!name && target !== 'jmk' &&
		!(target === "style" && program.all)) {
		U.die('generate requires a NAME such as third argument');
	}

	// validate the generate target
	if (!_.contains(CONST.GENERATE_TARGETS, target)) {
		U.die(
			'Invalid generate target "' + target + '"\n' +
			'Must be one of the following: [' + CONST.GENERATE_TARGETS.join(',') + ']'
		);
	}

	// launch requested generator
	(require('./targets/' + target))(name, args.slice(2), program);
}

module.exports = generate;
