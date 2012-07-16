var _ = require("../../lib/alloy/underscore")._,
	logger = require('../../common/logger');

module.exports = function(name, args, program) {
	_.each(['view', 'controller'], function(target) {
		(require('./' + target))(name, args, program);
	});
	logger.info('Generated view-controller named '+name);
}