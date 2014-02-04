var _ = require('../../../lib/alloy/underscore')._,
	U = require('../../../utils'),
	CU = require('../compilerUtils');

exports.parse = function(node, state) {
	return require('./base').parse(node, state, parse);
};

function parse(node, state, args) {
	// width is a valid property for a FIXED_SPACE button, add in if specified
	var width = (args.createArgs.width) ? ", width:'"+args.createArgs.width+"'" : "";
	return {
		parent: {
			node: node,
			symbol: args.symbol
		},
		styles: state.styles,
		code: args.symbol + ' = Ti.UI.createButton({systemButton: Ti.UI.iPhone.SystemButton.FIXED_SPACE'+width+'});'
	};
}