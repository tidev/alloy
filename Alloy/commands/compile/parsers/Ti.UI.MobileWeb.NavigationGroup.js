var _ = require('../../../lib/alloy/underscore')._,
	U = require('../../../utils'),
	CU = require('../compilerUtils'); 

exports.parse = function(node, state) {
	return require('./Ti.UI.iPhone.NavigationGroup').parse(node, state);
};