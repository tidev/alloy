var CU = require('../compilerUtils'),
	U = require('../../../utils');

exports.parse = function(node, state) {
	var args = CU.getParserArgs(node, state),
		code = '';

	// Validate widget
	if (!args.req) {
		U.die('Invalid Widget with ID "' + args.id + '", must have a "req" attribute');
	} 

	// Generate runtime code
	var commonjs = "alloy/widgets/" + args.req + "/components/widget";
	code += args.symbol + " = (require('" + commonjs + "')).create();\n";
	if (args.parent.symbol) {
		code += args.symbol + '.setParent(' + args.parent.symbol + ');\n';
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