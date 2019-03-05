var U = require('../../../utils');

var LOCALE_REGEX = /^\s*(?:L|Ti\.Locale\.getString|Titanium\.Locale\.getString)\(.+\)\s*$/;

exports.parse = function(node, state) {
	return require('./base').parse(node, state, parse);
};

function parse(node, state, args) {
	if (!state.itemsArray) {
		U.die('Invalid use of <Item>. Must be the child of <Items>.');
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
