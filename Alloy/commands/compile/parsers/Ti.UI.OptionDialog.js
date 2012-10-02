var _ = require('../../../lib/alloy/underscore')._,
	U = require('../../../utils'),
	CU = require('../compilerUtils'),
	logger = require('../../../common/logger');

exports.parse = function(node, state) {
	return require('./base').parse(node, state, parse);
};

function parse(node, state, args) {
	var children = U.XML.getElementsFromNodes(node.childNodes),
		types = {
			options: {
				collectionName: 'Options',
				itemName: 'Option',
				arrayName: CU.generateUniqueId(),
				first: true
			},
			buttonNames: {
				collectionName: 'ButtonNames',
				itemName: 'ButtonName',
				arrayName: CU.generateUniqueId(),
				first: true
			}
		},
		extras = [],
		code = '';

	// process all options and button names and create their arrays, if present
	_.each(types, function(type, typeName) {
		_.each(U.XML.getElementsFromNodes(node.childNodes), function(theNode) {
			if (theNode.nodeName === type.collectionName && !theNode.getAttribute('ns')) {
				_.each(U.XML.getElementsFromNodes(theNode.childNodes), function(item, index) {
					if (item.nodeName === type.itemName && !item.getAttribute('ns')) {
						var string = U.XML.getNodeText(item) || '';
						if (type.first) { 
							type.first = false;
							code += 'var ' + type.arrayName + ' = [];'; 
							extras.push([typeName, type.arrayName]);
						}
						code += type.arrayName + '.push("' + string.replace(/"/g,'\\"') + '");\n';
					} else {
						U.die([
							'Child element of <OptionDialog> at index ' + index + ' is not an <Option> or <ButtonName>',
							'All child elements of <OptionDialog> must be an <Option> or <ButtonName>.'
						]);
					}
				});

				// get rid of the items when done
				node.removeChild(theNode);
			} 
		});
	});

	// Add options and button names to the style, if present
	if (extras.length) {	
		state.extraStyle = CU.createVariableStyle(extras);
	}
	state.parent = {};

	var optionState = require('./default').parse(node, state);
	code += optionState.code;

	// Update the parsing state
	return _.extend(optionState, {code:code}); 
};