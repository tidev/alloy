var CU = require('../compilerUtils'),
	_ = require('../../../lib/alloy/underscore')._;

exports.parse = function(node, state) {
	return require('./base').parse(node, state, parse);
};

function parse(node, state, args) {
	var createFunc = 'create' + node.nodeName,
		code = '';

	// make symbol a local variable if necessary
	if (state.local) {
		args.symbol = CU.generateUniqueId(); 
	}

	// Generate runtime code
	code += (state.local ? 'var ' : '') + args.symbol + " = A$(" + args.ns + "." + createFunc + "(\n";
	code += CU.generateStyleParams(
		state.styles, 
		args.classes, 
		args.id, 
		node.nodeName, 
		_.defaults(state.extraStyle || {}, args.createArgs || {}),
		state 
	) + '\n';
	code += "),'" + node.nodeName + "', " + (args.parent.symbol || 'null') + ");\n";
	if (args.parent.symbol) {
		code += args.parent.symbol + ".add(" + args.symbol + ");\n";
	} 

	// Update the parsing state
	return {
		parent: {
			node: node,
			symbol: args.symbol
		},
		local: state.local || false,
		styles: state.styles,
		code: code
	}
};