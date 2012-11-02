var path = require('path'),
	logger = require('../../common/logger'),
	U = require('../../utils'),
	CONST = require('../../common/constants'),
	alloyRoot = path.join(__dirname,'..','..','..'); 

module.exports = function(args, program) {
	var errMsg = 'Must be one of the following: [' + CONST.INSTALL_TYPES.join(',') + ']';
	var type = args[0] || U.die(['`alloy install` must have a type', errMsg]);

	switch(type) {
		case 'plugin':
			var paths = U.getAndValidateProjectPaths(args[1] || '.');
			U.installPlugin(alloyRoot, paths.project);
			logger.info('Alloy plugins and hooks installed in project at "' + paths.project + '"');
			break;
		default:
			U.die(['Invalid install type "' + type + '" for `alloy install`', errMsg]);
			break;
	}
}
