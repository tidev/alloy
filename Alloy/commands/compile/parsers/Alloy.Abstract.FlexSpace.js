var U = require('../../../utils'),
	CU = require('../compilerUtils'),
	tiapp = require('../../../tiapp');

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
		code: args.symbol + ' = Ti.UI.createButton({systemButton: Ti.UI.iOS.SystemButton.FLEXIBLE_SPACE});'
	};
}
