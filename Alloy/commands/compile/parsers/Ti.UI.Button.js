var _ = require('lodash'),
	styler = require('../styler'),
	CU = require('../compilerUtils'),
	U = require('../../../utils'),
	logger = require('../../../logger'),
	tiapp = require('../../../tiapp');

var MIN_VERSION = '5.4.0';

var systemButtons = [
	'ACTION', 'ACTIVITY', 'ADD', 'BOOKMARKS', 'CAMERA', 'CANCEL', 'COMPOSE', 'CONTACT_ADD',
	'DISCLOSURE', 'DONE', 'EDIT', 'FAST_FORWARD', 'FIXED_SPACE', 'FLEXIBLE_SPACE', 'INFO_DARK',
	'INFO_LIGHT', 'NEUTRAL', 'ORGANIZE', 'PAUSE', 'PLAY', 'POSITIVE', 'REFRESH', 'REPLY', 'REWIND',
	'SAVE', 'SPINNER', 'STOP', 'TRASH'
];

var deprecatedSystemButtons = {
	DONE: 'POSITIVE',
	BORDERED: 'NEUTRAL',
	PLAIN: 'NEUTRAL'
};

exports.parse = function(node, state) {
	return require('./base').parse(node, state, parse);
};

function parse(node, state, args) {
	// Get button title from node text, if present
	var nodeText = U.XML.getNodeText(node);
	var buttonPrefix = 'Ti.UI.iOS.SystemButton.';

	if (nodeText) {
		state.extraStyle = styler.createVariableStyle('title', U.possibleMultilineString(U.trim(nodeText.replace(/'/g, "\\'"))));
	}

	var systemButton = node.getAttribute('systemButton');

	// Auto-fix deprecated enums
	if (Object.prototype.hasOwnProperty.call(deprecatedSystemButtons, systemButton)) {
		logger.warn(`${buttonPrefix}${systemButton} is deprecated in favor of ${buttonPrefix}${deprecatedSystemButtons[systemButton]}`);
		systemButton = deprecatedSystemButtons[systemButton];
	}

	if (_.includes(systemButtons, systemButton)) {
		node.setAttribute('systemButton', buttonPrefix + systemButton);
	}

	// Generate runtime code using default
	return require('./default').parse(node, state);
}
