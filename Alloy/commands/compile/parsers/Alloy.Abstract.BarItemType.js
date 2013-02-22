var _ = require('../../../lib/alloy/underscore')._,
	U = require('../../../utils'),
	CU = require('../compilerUtils'); 

exports.parse = function(node, state) {
	return require('./base').parse(node, state, parse);
};

function parse(node, state, args) {
	if (!state.itemsArray) {
		U.dieWithNode(node, 'Invalid use of <Label>. Must be the child of <Labels>.');
	}

	// grab BarItemType attributes from node
	var obj = {};
	var title = (U.XML.getNodeText(node) || node.getAttribute('title') || '');
	var image = node.getAttribute('image');
	var enabled = node.getAttribute('enabled') !== 'false'; // defaults to true
	var width = node.getAttribute('width');

	// assign valid values to the object
	if (title) { obj.title = title; }
	if (image) { obj.image = image; }
	if (!enabled) { obj.enabled = false; }
	if (width) { obj.width = width; }

	// simplify the generated code if possible
	if (_.isEmpty(obj)) {
		// warn if there was no properties assigned
		logger.warn('<BarItemType> at index ' + index + ' has no properties');
	} 

	state.local = true;
	state.extraStyle = obj;
	var itemState = require('./default_abstract').parse(node, state);
	delete state.local;
	delete state.extraStyle;

	var code = itemState.code;
	!state.model && (code += state.itemsArray + '.push(' + itemState.parent.symbol + ');'); 

	return {
		parent: {},
		code: code
	};
}