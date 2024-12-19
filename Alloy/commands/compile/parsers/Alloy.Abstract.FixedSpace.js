var U = require('../../../utils'),
	CU = require('../compilerUtils'),
	tiapp = require('../../../tiapp');

exports.parse = function(node, state) {
	return require('./base').parse(node, state, parse);
};

function parse(node, state, args) {
	// width is a valid property for a FIXED_SPACE button, add in if specified
	var width = (args.createArgs.width) ? ", width:'" + args.createArgs.width + "'" : '';

	return {
		parent: {
			node: node,
			symbol: args.symbol
		},
		styles: state.styles,
		code: args.symbol + ' = Ti.UI.createButton({systemButton: Ti.UI.iOS.SystemButton.FIXED_SPACE' + width + '});'
	};
}
