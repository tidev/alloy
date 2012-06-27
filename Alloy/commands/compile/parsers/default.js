var CU = require('../compilerUtils');

exports.parse = function(node, state, extraStyle) {
	var args = CU.getParserArgs(node, state),
		createFunc = 'create' + node.nodeName,
		linePrefix = '\t';
		code = '';

	// Generate runtime code
	code += linePrefix + args.symbol + " = A$(" + args.ns + "." + createFunc + "({\n";
	code += CU.generateStyleParams(state.styles, args.classes, args.id, node.nodeName, extraStyle) + '\n';
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