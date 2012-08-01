var CU = require('../compilerUtils'),
	U = require('../../../utils');

exports.parse = function(node, state) {
	return require('./base').parse(node, state, parse);
};

function parse(node, state, args) {
	var code = '';

	// Validate widget
	if (!args.req) {
		U.die('Invalid Widget with ID "' + args.id + '", must have a "require" attribute');
	} 

	// Generate runtime code
	var cPath = args.req + "/controllers/widget";
	//code += args.symbol + " = (require('" + commonjs + "')).create(" + CU.generateStyleParams(
	code += args.symbol + " = new (Alloy.getController('" + cPath + "'))(" + CU.generateStyleParams(
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
			symbol: args.symbol + '.getRoot()'
		},
		styles: state.styles,
		code: code
	}
};