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

	// Generate runtime code
	code += '\t' + symbol + " = A$(" + ns + "." + createFunc + "({\n";
	code += CU.generateStyleParams(styles,classes,id,node.nodeName) + '\n';
	code += "\t}),'" + node.nodeName + "', " + (parent.symbol || 'null') + ");\n\t";
	if (parent.symbol) {
		code += parent.symbol + ".add(" + symbol + ");\n";
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