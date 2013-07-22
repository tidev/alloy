var _ = require('../../../lib/alloy/underscore')._,
	U = require('../../../utils'),
	CU = require('../compilerUtils');

exports.parse = function(node, state) {
	return require('./base').parse(node, state, parse);
};

function parse(node, state, args) {
	if (!state.itemsArray) {
		U.die('Invalid use of <ButtonName>. Must be the child of <ButtonNames>.');
	}
	var string = U.trim(U.XML.getNodeText(node) || '').replace(/"/g,'\\"');

	return {
		parent: {},
		styles: state.styles,
		code: state.itemsArray + '.push("' + string + '");'
	};
}