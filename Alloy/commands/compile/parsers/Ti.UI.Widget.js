var CU = require('../compilerUtils'),
	U = require('../../../utils');

exports.parse = function(node, ns, id, styles, state) {
	var symbol = CU.generateVarName(id),
		classes = node.getAttribute('class').split(' '),
		fullname = ns + '.' + node.nodeName,
		req = node.getAttribute('require'),
		createFunc = 'create' + node.nodeName,
		symbol = CU.generateVarName(id),
		parent = state.parent || {};
		code = '';

	// Validate widget
	if (!req) {
		U.die('Invalid Widget with ID "' + id + '", must have a "req" attribute');
	} 

	// Generate runtime code
	var commonjs = "alloy/widgets/" + req + "/components/widget";
	code += symbol + " = (require('" + commonjs + "')).create();\n";
	if (parent.symbol) {
		code += symbol + '.setParent(' + parent.symbol + ');\n';
	} else {
		code += "root$ = " + symbol + ";\n";
	}

	// Update the parsing state
	return {
		parent: {
			node: node,
			symbol: symbol
		},
		code: code
	}
};