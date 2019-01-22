var U = require('../../../utils'),
	CU = require('../compilerUtils'),
	tiapp = require('../../../tiapp'),
	iOSProxy;

var MIN_VERSION = '5.4.0';

exports.parse = function(node, state) {
	return require('./base').parse(node, state, parse);
};

function parse(node, state, args) {
	// width is a valid property for a FIXED_SPACE button, add in if specified
	var width = (args.createArgs.width) ? ", width:'" + args.createArgs.width + "'" : '';

	if (tiapp.version.gte(tiapp.getSdkVersion(), MIN_VERSION)) {
		iOSProxy = 'iOS';
	} else {
		iOSProxy = 'iPhone';
	}

	return {
		parent: {
			node: node,
			symbol: args.symbol
		},
		styles: state.styles,
		code: args.symbol + ' = Ti.UI.createButton({systemButton: Ti.UI.' + iOSProxy + '.SystemButton.FIXED_SPACE' + width + '});'
	};
}
