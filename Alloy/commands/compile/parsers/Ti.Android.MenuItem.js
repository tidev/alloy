var _ = require('../../../lib/alloy/underscore')._,
	U = require('../../../utils'),
	CU = require('../compilerUtils');

exports.parse = function(node, state) {
	return require('./base').parse(node, state, parse);
};

function parse(node, state, args) {
	return {
		parent: {},
		styles: state.styles,
		code: require('./default').parse(node, _.extend(state, { abstractType: true })).code
	}
}