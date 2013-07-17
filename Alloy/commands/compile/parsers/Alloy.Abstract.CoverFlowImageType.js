var U = require('../../../utils');

exports.parse = function(node, state) {
	return require('./base').parse(node, state, parse);
};

function parse(node, state, args) {
	if (!state.itemsArray) {
		U.die('A CoverFlowImageType element must the child of a CoverFlowImageTypes element');
	}

	var obj = {};
	var image = U.XML.getNodeText(node) || node.getAttribute('image');
	var height = node.getAttribute('height');
	var width = node.getAttribute('width');

	if (image) { obj.image = image; }
	if (height) { obj.height = height; }
	if (width) { obj.width = width; }

	state.local = true;
	state.extraStyle = obj;
	var itemState = require('./default_abstract').parse(node, state);
	delete state.local;
	delete state.extraStyle;

	var code = itemState.code;
	if (!state.model) {
		code += state.itemsArray + '.push(' + itemState.parent.symbol + ');';
	}

	return {
		parent: {},
		code: code
	};
}