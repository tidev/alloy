var CU = require('../compilerUtils');

exports.parse = function(node, state) {
	return require('./base').parse(node, state, parse);
};

function parse(node, state, args) {
	var createFunc = 'create' + node.nodeName,
		code = '';

	// Generate runtime code
	code += args.symbol + " = A$(" + args.ns + "." + createFunc + "({\n";
	code += CU.generateStyleParams(state.styles, args.classes, args.id, node.nodeName, state.extraStyle) + '\n';
	code += "}),'" + node.nodeName + "', " + (args.parent.symbol || 'null') + ");\n";
	if (args.parent.symbol) {
		code += args.parent.symbol + ".add(" + args.symbol + ");\n";
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