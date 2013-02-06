var _ = require('../../../lib/alloy/underscore')._,
	U = require('../../../utils'),
	CU = require('../compilerUtils'),
	CONST = require('../../../common/constants');

var VALID = [
	'Ti.UI.DashboardItem'
];

exports.parse = function(node, state) {
	return require('./base').parse(node, state, parse);
};

function parse(node, state, args) {
	var children = U.XML.getElementsFromNodes(node.childNodes),
		arrayName = CU.generateUniqueId(),
		isCollectionBound = args[CONST.BIND_COLLECTION] ? true : false,
		code = 'var ' + arrayName + '=[];\n';

	// iterate through all children
	if (!isCollectionBound) {
		_.each(U.XML.getElementsFromNodes(node.childNodes), function(child, index) {
			if (CU.validateNodeName(child, VALID)) {
				// generate code for the DashboardItem
				code += CU.generateNodeExtended(child, state, {
					parent: {},
					post: function(node, state, args) {
						return arrayName + '.push(' + state.parent.symbol + ');\n';
					}
				});

				// When we are done processing the DashboardItem, remove it from the
				// markup. That way we can just pass back the current DashboardView state as 
				// the returned state and it can continue to process any other children
				// without special handling
				node.removeChild(child);
			}
		});
	}

	// Create the initial DashboardView code
	if (isCollectionBound) {
		_.each(CONST.BIND_PROPERTIES, function(p) {
			node.removeAttribute(p);
		});
	}
	state.extraStyle = CU.createVariableStyle('data', arrayName);
	var dashState = require('./default').parse(node, state);
	code += dashState.code;

	if (isCollectionBound) {
		var localModel = CU.generateUniqueId();
		var itemCode = '';
		var localArray = 'data';

		_.each(U.XML.getElementsFromNodes(node.childNodes), function(child) {
			// generate the repeated element
			itemCode += CU.generateNode(child, {
				parent: {},
				local: true,
				model: localModel,
				post: function(node, state, args) {
					return localArray + '.push(' + state.parent.symbol + ');\n';
				}
			});

			// remove it from the XML
			node.removeChild(child);
		});

		code += _.template(CU.generateCollectionBindingTemplate(args), {
			localModel: localModel,
			pre: 'var ' + localArray + '=[];',
			items: itemCode,
			post: dashState.parent.symbol + '.data=' + localArray + ';'
		});
	} 

	// Update the parsing state
	return _.extend(dashState, {code:code}); 
};