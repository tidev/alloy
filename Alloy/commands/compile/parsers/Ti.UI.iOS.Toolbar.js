var _ = require('../../../lib/alloy/underscore')._,
	U = require('../../../utils'),
	CU = require('../compilerUtils');

var FLEXSPACE = 'Ti.UI.createButton({\n' +
'	systemButton: Ti.UI.iPhone.SystemButton.FLEXIBLE_SPACE\n' +
'})';

exports.parse = function(node, state) {
	return require('./base').parse(node, state, parse);
};

function parse(node, state, args) {
	var children = U.XML.getElementsFromNodes(node.childNodes),
		arrayName = CU.generateUniqueId(),
		code = 'var ' + arrayName + ' = [];\n';

	// process all Items and create their array, if present
	_.each(U.XML.getElementsFromNodes(node.childNodes), function(theNode) {
		if (theNode.nodeName === 'Items' && !theNode.getAttribute('ns')) {
			_.each(U.XML.getElementsFromNodes(theNode.childNodes), function(item) {
				if (item.nodeName === 'FlexSpace' && !item.getAttribute('ns')) {
					code += arrayName + '.push(' + FLEXSPACE + ');\n';
				} else {
					code += CU.generateNode(item, {
						parent: {},
						styles: state.styles,
						post: function(node, state, args) {
							return arrayName + '.push(' + state.parent.symbol + ');\n';
						}
					});
				}
			});

			// get rid of the items when done
			node.removeChild(theNode);
		} 
	});

	// Create the initial Toolbar code and let it process its remaing children, if any
	state.extraStyle = CU.createVariableStyle('items', arrayName);
	var toolbarState = require('./default').parse(node, state);
	code += toolbarState.code;

	// Update the parsing state
	return _.extend(toolbarState, {code:code}); 
};