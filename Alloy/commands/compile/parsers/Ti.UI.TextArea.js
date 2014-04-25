var _ = require('../../../lib/alloy/underscore')._,
	styler = require('../styler'),
	CU = require('../compilerUtils'),
	U = require('../../../utils');

var KEYBOARD_TYPES = [
	'DEFAULT', 'ASCII', 'NUMBERS_PUNCTUATION', 'URL', 'EMAIL', 'DECIMAL_PAD', 'NAMEPHONE_PAD',
	'NUMBER_PAD', 'PHONE_PAD'
];
var RETURN_KEY_TYPES = [
	'DEFAULT', 'DONE', 'EMERGENCY_CALL', 'GO', 'GOOGLE', 'JOIN', 'NEXT', 'ROUTE',
	'SEARCH', 'SEND', 'YAHOO'
];
var AUTOCAPITALIZATION_TYPES = [
	'ALL', 'NONE', 'SENTENCES', 'WORDS'
];

exports.parse = function(node, state) {
	return require('./base').parse(node, state, parse);
};

function parse(node, state, args) {
	// convert clearOnEdit to a boolean
	if (node.hasAttribute('clearOnEdit')) {
		var attr = node.getAttribute('clearOnEdit');
		state.extraStyle = styler.createVariableStyle('clearOnEdit', attr === 'true');
	}

	// support shortcuts for keyboard type, return key type, and autocapitalization
	var keyboardType = node.getAttribute('keyboardType');
	if (_.contains(KEYBOARD_TYPES, keyboardType.toUpperCase())) {
		node.setAttribute('keyboardType', 'Ti.UI.KEYBOARD_' + keyboardType.toUpperCase());
	}
	var returnKey = node.getAttribute('returnKeyType');
	if (_.contains(RETURN_KEY_TYPES, returnKey.toUpperCase())) {
		node.setAttribute('returnKeyType', 'Ti.UI.RETURNKEY_' + returnKey.toUpperCase());
	}
	var autocapitalization = node.getAttribute('keyboardType');
	if (_.contains(AUTOCAPITALIZATION_TYPES, autocapitalization.toUpperCase())) {
		node.setAttribute('autocapitalization', 'Ti.UI.TEXT_AUTOCAPITALIZATION_' + autocapitalization.toUpperCase());
	}

	// Generate runtime code using default
	return require('./default').parse(node, state);
}