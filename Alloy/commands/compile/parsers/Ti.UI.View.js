var CU = require('../compilerUtils');

exports.parse = function(node, ns, id, styles, state) {
	var symbol = CU.generateVarName(id),
		classes = node.getAttribute('class').split(' '),
		fullname = ns + '.' + node.nodeName,
		req = node.getAttribute('require'),
		createFunc = 'create' + node.nodeName,
		symbol = CU.generateVarName(id),
		parent = state.parent || {};
		code = '';

	// We only need special handling if there's a req attribute
	if (!req) {
		return require('./default').parse(node, ns, id, styles, state);
	} 

	// Generate runtime code
	var commonjs = "alloy/components/" + req;
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