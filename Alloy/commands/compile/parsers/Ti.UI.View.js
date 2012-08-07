var CU = require('../compilerUtils');

exports.parse = function(node, state) {
	return require('./base').parse(node, state, parse);
};

function parse(node, state, args) {
	var code = '';

	// We only need special handling if there's a req attribute
	if (!args.req) {
		return require('./default').parse(node, state);
	} 

	// Generate runtime code
	code += args.symbol + " = new (Alloy.getController('" + args.req + "'))(" + CU.generateStyleParams(
		state.styles, 
		args.classes, 
		args.id, 
		node.nodeName, 
		args.createArgs
	) + ");\n";
	if (args.parent.symbol) {
		code += args.symbol + '.setParent(' + args.parent.symbol + ');\n';
	} 

	// Update the parsing state
	return {
		parent: {
			node: node,
			symbol: args.symbol + '.getRoots()'
		},
		styles: state.styles,
		code: code
	}
};