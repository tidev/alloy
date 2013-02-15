var _ = require('../../../lib/alloy/underscore')._,
	U = require('../../../utils'),
	CU = require('../compilerUtils'); 

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

	if (_.isEmpty(obj)) {
		// warn if there was no properties assigned
		logger.warn('Child element of <CoverFlowView> at index ' + index + ' has no properties');
	} 
	
	state.local = true;
	state.extraStyle = obj;  //CU.createVariableStyle(extras); 
	var itemState = require('./default_abstract').parse(node, state);
	var code = itemState.code;
	!state.model && (code += state.itemsArray + '.push(' + itemState.parent.symbol + ');'); 

	return {
		parent: {},
		code: code
	};
}