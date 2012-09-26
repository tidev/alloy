var _ = require('../../../lib/alloy/underscore')._,
	U = require('../../../utils'),
	CU = require('../compilerUtils'); 

exports.parse = function(node, state) {
	node.nodeName = 'Require';
	node.setAttribute('type','widget');
	return require('./Alloy.Require').parse(node, state);
};