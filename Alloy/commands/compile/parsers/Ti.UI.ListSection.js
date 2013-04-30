var _ = require('../../../lib/alloy/underscore')._,
	U = require('../../../utils'),
	CU = require('../compilerUtils'),
	CONST = require('../../../common/constants');

var VALID = [
	'Ti.UI.ListItem'
];

exports.parse = function(node, state) {
	return require('./base').parse(node, state, parse);
};

function parse(node, state, args) {
	var code = '',
		itemCode = '',
		itemsVar = CU.generateUniqueId(),
		isDataBound = args[CONST.BIND_COLLECTION] ? true : false,
		itemsArray, localModel;

	// process each child
	var children = U.XML.getElementsFromNodes(node.childNodes);
	_.each(children, function(child) {
		var theNode = CU.validateNodeName(child, VALID);
		if (!theNode) {
			U.dieWithNode(child, 'Child element must be one of the following: [' + VALID.join(',') + ']');
		} else if (theNode === 'Ti.UI.ListItem') {
			if (!itemsArray) {
				itemsArray = CU.generateUniqueId();
				code += 'var ' + itemsArray + '=[];';
			}

			if (isDataBound) {
				localModel || (localModel = CU.generateUniqueId());
				itemCode += CU.generateNodeExtended(child, state, {
					parent: {},
					local: true,
					model: localModel,
					post: function(node, state, args) {
						return itemsVar + '.push(' + state.parent.symbol + ');';
					}
				});
			} else {
				code += CU.generateNodeExtended(child, state, {
					parent: {},
					post: function(node, state, args) {
						return itemsArray + '.push(' + state.parent.symbol + ');';
					}
				});
			}
		} 
	});

	// create the ListView itself
	if (isDataBound) {
		_.each(CONST.BIND_PROPERTIES, function(p) {
			node.removeAttribute(p);
		});
	}
	var sectionState = require('./default').parse(node, state);
	code += sectionState.code;

	// add items to the ListView
	if (itemsArray) {
		code += sectionState.parent.symbol + '.items=' + itemsArray + ';';
	}

	// finally, fill in any model-view binding code, if present
	if (isDataBound) {
		localModel || (localModel = CU.generateUniqueId());
		code += _.template(CU.generateCollectionBindingTemplate(args), {
			localModel: localModel,
			pre: 'var ' + itemsVar + '=[];',
			items: itemCode,
			post: sectionState.parent.symbol + '.setItems(' + itemsVar + ');'
		});
	}

	return {
		parent: {},
		styles: state.styles,
		code: code
	}
}
