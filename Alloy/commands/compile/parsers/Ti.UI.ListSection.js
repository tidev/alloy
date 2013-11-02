var _ = require('../../../lib/alloy/underscore')._,
	U = require('../../../utils'),
	CU = require('../compilerUtils'),
	CONST = require('../../../common/constants');

var PROXY_PROPERTIES = [
	'_ProxyProperty._Lists.HeaderView',
	'_ProxyProperty._Lists.FooterView'
];
var VALID = [
	'Ti.UI.ListItem'
];
var ALL_VALID = _.union(PROXY_PROPERTIES, VALID);

exports.parse = function(node, state) {
	return require('./base').parse(node, state, parse);
};

function parse(node, state, args) {
	var code = '',
		itemCode = '',
		proxyPropertyCode = '',
		itemsVar = CU.generateUniqueId(),
		isDataBound = args[CONST.BIND_COLLECTION] ? true : false,
		itemsArray, localModel;

	// process each child
	var children = U.XML.getElementsFromNodes(node.childNodes);
	_.each(children, function(child) {
		var theNode = CU.validateNodeName(child, ALL_VALID);
		if (!theNode) {
			U.dieWithNode(child, 'Child element must be one of the following: [' + ALL_VALID.join(',') + ']');
		} else if (_.contains(PROXY_PROPERTIES, theNode)) {
			proxyPropertyCode += CU.generateNodeExtended(child, state, {
				parent: {
					node: node,
					symbol: '<%= proxyPropertyParent %>'
				},

				// don't use the "post" from Ti.UI.ListSection
				post: null
			});
		} else if (theNode === 'Ti.UI.ListItem') {
			if (!itemsArray) {
				itemsArray = CU.generateUniqueId();
				code += 'var ' + itemsArray + '=[];';
			}

			if (isDataBound) {
				localModel = localModel || CU.generateUniqueId();
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

	// fill in the proxy property assignment template with the
	// symbol used to represent the listsection
	code += _.template(proxyPropertyCode, {
		proxyPropertyParent: sectionState.parent.symbol
	});

	// add items to the ListView
	if (itemsArray) {
		code += sectionState.parent.symbol + '.items=' + itemsArray + ';';
	}

	// finally, fill in any model-view binding code, if present
	if (isDataBound) {
		localModel = localModel || CU.generateUniqueId();
		var sps = sectionState.parent.symbol;

		code += _.template(CU.generateCollectionBindingTemplate(args), {
			localModel: localModel,
			pre: 'var ' + itemsVar + '=[];',
			items: itemCode,
			post: 'opts.animation ? ' +
				sps + '.setItems(' + itemsVar + ', opts.animation) : ' +
				sps + '.setItems(' + itemsVar + ');'
		});
	}

	return {
		parent: {},
		styles: state.styles,
		code: code
	};
}