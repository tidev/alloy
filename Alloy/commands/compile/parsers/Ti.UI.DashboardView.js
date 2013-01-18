var _ = require('../../../lib/alloy/underscore')._,
	U = require('../../../utils'),
	CU = require('../compilerUtils');

var VALID = [
	'Ti.UI.DashboardItem'
];

exports.parse = function(node, state) {
	return require('./base').parse(node, state, parse);
};

function parse(node, state, args) {
	var children = U.XML.getElementsFromNodes(node.childNodes),
		arrayName = CU.generateUniqueId(),
		code = 'var ' + arrayName + ' = [];\n';

	// iterate through all children
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

	// Create the initial Map code
	state.extraStyle = CU.createVariableStyle('data', arrayName);
	var dashState = require('./default').parse(node, state);
	code += dashState.code;

	// Update the parsing state
	return _.extend(dashState, {code:code}); 
};