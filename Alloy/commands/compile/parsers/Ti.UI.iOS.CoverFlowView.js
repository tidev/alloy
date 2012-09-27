var _ = require('../../../lib/alloy/underscore')._,
	U = require('../../../utils'),
	CU = require('../compilerUtils'),
	logger = require('../../../common/logger');

exports.parse = function(node, state) {
	return require('./base').parse(node, state, parse);
};

function parse(node, state, args) {
	var children = U.XML.getElementsFromNodes(node.childNodes),
		arrayName = CU.generateUniqueId(),
		code = 'var ' + arrayName + ' = [];\n',
		hasImages = false;

	// process all Images and create their array, if present
	_.each(U.XML.getElementsFromNodes(node.childNodes), function(theNode) {
		if (theNode.nodeName === 'Images' && !theNode.getAttribute('ns')) {
			hasImages = true;
			_.each(U.XML.getElementsFromNodes(theNode.childNodes), function(item, index) {
				if (item.nodeName === 'Image' && !item.getAttribute('ns')) {
					// per the Titanium docs, these "images" can be represented as
					// either strings or a CoverFlowImageType 
					var obj = {};
					var image = U.XML.getNodeText(item) || item.getAttribute('image');
					var height = item.getAttribute('height');
					var width = item.getAttribute('width');

					if (image) { obj.image = image; }
					if (height) { obj.height = height; }
					if (width) { obj.width = width; }

					if (_.isEmpty(obj)) {
						// warn if ther ewas no properties assigned
						logger.warn('Child element of <CoverFlowView> at index ' + index + ' has no properties');
					} else if (obj.image && obj.length === 1) {
						obj = obj.image;
					}

					code += arrayName + '.push(' + JSON.stringify(obj) + ');\n';
				} else {
					U.die([
						'Child element of <CoverFlowView> at index ' + index + ' is not an <Image>',
						'All child elements of <CoverFlowView> must be a <Image>.'
					]);
				}
			});

			// get rid of the items when done
			node.removeChild(theNode);
		} 
	});

	// Create the initial Toolbar code and let it process its remaing children, if any
	if (hasImages) {
		state.extraStyle = CU.createVariableStyle('images', arrayName);
	}
	var cfvState = require('./default').parse(node, state);
	code += cfvState.code;

	// Update the parsing state
	return _.extend(cfvState, {code:code}); 
};