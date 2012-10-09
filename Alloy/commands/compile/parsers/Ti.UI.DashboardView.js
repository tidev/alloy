var _ = require('../../../lib/alloy/underscore')._,
	U = require('../../../utils'),
	CU = require('../compilerUtils');

exports.parse = function(node, state) {
	return require('./base').parse(node, state, parse);
};

function parse(node, state, args) {
	var children = U.XML.getElementsFromNodes(node.childNodes),
		arrayName = CU.generateUniqueId(),
		code = 'var ' + arrayName + ' = [];\n';

	// iterate through all children
	for (var i = 0, l = children.length; i < l; i++) {
		var child = children[i],
			childArgs = CU.getParserArgs(child);

		// Process the Map's Annotations
		if (childArgs.fullname === 'Ti.UI.DashboardItem' ||
			childArgs.fullname === 'Alloy.Require') {
			// ensure <Require> is actually a single <Annotation>
			if (childArgs.fullname === 'Alloy.Require') {
				var inspect = CU.inspectRequireNode(child);
				if (inspect.length !== 1 || inspect.names[0] !== 'Ti.UI.DashboardItem') {
					// The <Require> is not a DashboardItem, process later
					continue;
				}
			}

			// generate code for the DashboardItem
			code += CU.generateNode(child, {
				parent: {},
				styles: state.styles,
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
	}

	// Create the initial Map code
	state.extraStyle = CU.createVariableStyle('data', arrayName);
	var dashState = require('./default').parse(node, state);
	code += dashState.code;

	// Update the parsing state
	return _.extend(dashState, {code:code}); 
};