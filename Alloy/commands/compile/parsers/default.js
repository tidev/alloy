var CU = require('../compilerUtils');

exports.parse = function(node, state, args) {
	var createFunc = 'create' + node.nodeName,
		linePrefix = '\t';
		code = '';

	// Generate runtime code
	code += linePrefix + args.symbol + " = A$(" + args.ns + "." + createFunc + "({\n";
	code += CU.generateStyleParams(state.styles, args.classes, args.id, node.nodeName) + '\n';
	code += linePrefix + "}),'" + node.nodeName + "', " + (args.parent.symbol || 'null') + ");\n";
	if (args.parent.symbol) {
		code += linePrefix + args.parent.symbol + ".add(" + args.symbol + ");\n";
	} else {
		code += linePrefix + "root$ = " + args.symbol + ";\n";
	}

	// Update the parsing state
	return {
		parent: {
			node: node,
			symbol: args.symbol
		},
		styles: state.styles,
		code: code
	}
};