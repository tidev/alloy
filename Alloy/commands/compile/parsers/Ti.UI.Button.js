var _ = require('lodash'),
	styler = require('../styler'),
	CU = require('../compilerUtils'),
	U = require('../../../utils'),
	tiapp = require('../../../tiapp');

var systemButtons = [
	'ACTION', 'ACTIVITY', 'ADD', 'BOOKMARKS', 'CAMERA', 'CANCEL', 'COMPOSE', 'CONTACT_ADD',
	'DISCLOSURE', 'DONE', 'EDIT', 'FAST_FORWARD', 'FIXED_SPACE', 'FLEXIBLE_SPACE', 'INFO_DARK',
	'INFO_LIGHT', 'ORGANIZE', 'PAUSE', 'PLAY', 'REFRESH', 'REPLY', 'REWIND', 'SAVE', 'SPINNER',
	'STOP', 'TRASH'
];

exports.parse = function(node, state) {
	return require('./base').parse(node, state, parse);
};

function parse(node, state, args) {
	// Get button title from node text, if present
	var nodeText = U.XML.getNodeText(node);
	if (nodeText) {
		state.extraStyle = styler.createVariableStyle('title', U.possibleMultilineString(U.trim(nodeText.replace(/'/g, "\\'"))));
	}

	var systemButton = node.getAttribute('systemButton');
	if (_.includes(systemButtons, systemButton)) {
		node.setAttribute('systemButton', 'Ti.UI.iOS.SystemButton.' + systemButton);
	}

	// Generate runtime code using default
	return require('./default').parse(node, state);
}
