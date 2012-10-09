var path = require('path'),
	logger = require('../../common/logger'),
	U = require('../../utils'),
	alloyRoot = path.join(__dirname,'..','..','..'); 

// TODO: these should be broken out into individual modules, like in generate
var TARGETS = ['plugin'];

module.exports = function(args, program) {
	var target = args[0] || U.die([
		'`alloy install` must have a target',
		'usage: alloy install plugin PROJECT_PATH'
	]);
	var paths = U.getAndValidateProjectPaths(args[1] || '.');

	switch(target) {
		case 'plugin':
			U.installPlugin(alloyRoot, paths.project);
			logger.info('Alloy plugins and hooks installed in project at "' + paths.project + '"');
			break;
		default:
			U.die([
				'Invalid target "' + target + '" for `alloy install`',
				'Must be one of the following: [' + TARGETS.join(',') + ']'
			]);
			break;
	}
}
