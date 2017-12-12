var U = require('../../../utils'),
	CU = require('../compilerUtils');

exports.parse = function(node, state) {
	return require('./base').parse(node, state, parse);
};

function parse(node, state, args) {
	if (!state.itemsArray) {
		U.die('Invalid use of <ButtonName>. Must be the child of <ButtonNames>.');
	}

	var nodeText = U.trim(U.XML.getNodeText(node) || '');
	var returnCode = '';

	if (U.isLocaleAlias(nodeText)) {
		returnCode = '.push(' + nodeText + ');';
	} else {
		returnCode = '.push("' + nodeText.replace(/"/g, '\\"') + '");';
	}

	return {
		parent: {},
		styles: state.styles,
		code: state.itemsArray + returnCode
	};
}
