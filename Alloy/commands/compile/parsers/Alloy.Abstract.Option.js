var _ = require('../../../lib/alloy/underscore')._,
	U = require('../../../utils'),
	CU = require('../compilerUtils');

var LOCALE_REGEX = /^\s*(?:L|Ti\.Locale\.getString|Titanium\.Locale\.getString)\(.+\)\s*$/;

exports.parse = function(node, state) {
	return require('./base').parse(node, state, parse);
};

function parse(node, state, args) {
	if (!state.itemsArray) {
		U.die('Invalid use of <Option>. Must be the child of <Options>.');
	}

	var string = U.trim(U.XML.getNodeText(node) || '');
	if (!LOCALE_REGEX.test(string)) {
		string = '"' + string.replace(/"/g, '\\"') + '"';
	}

	return {
		parent: {},
		styles: state.styles,
		code: state.itemsArray + '.push(' + string + ');'
	};
}