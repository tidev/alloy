var _ = require('../../../lib/alloy/underscore')._,
	U = require('../../../utils'),
	CU = require('../compilerUtils'); 

exports.parse = function(node, state) {
	return require('./base').parse(node, state, parse);
};

function parse(node, state, args) {
	return {
		parent: {
			node: node,
			symbol: args.symbol
		},
		styles: state.styles,
		code: args.symbol + ' = Ti.UI.createButton({systemButton: Ti.UI.iPhone.SystemButton.FLEXIBLE_SPACE});'
	};
}