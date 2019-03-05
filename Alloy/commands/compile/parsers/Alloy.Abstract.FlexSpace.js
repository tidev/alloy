var U = require('../../../utils'),
	CU = require('../compilerUtils'),
	tiapp = require('../../../tiapp'),
	iOSProxy;

var MIN_VERSION = '5.4.0';

exports.parse = function(node, state) {
	return require('./base').parse(node, state, parse);
};

function parse(node, state, args) {

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
		code: args.symbol + ' = Ti.UI.createButton({systemButton: Ti.UI.' + iOSProxy + '.SystemButton.FLEXIBLE_SPACE});'
	};
}
