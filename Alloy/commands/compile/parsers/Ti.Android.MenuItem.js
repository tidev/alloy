var CU = require('../compilerUtils'),
	_ = require('../../../lib/alloy/underscore')._;

exports.parse = function(node, state) {
	return require('./base').parse(node, state, parse);
};

function parse(node, state, args) {
	var code = '';

	code += args.symbol + ' = A$(' + state.parent.symbol + '.add(';
	code += CU.generateStyleParams(
		state.styles, 
		args.classes, 
		args.id, 
		node.nodeName, 
		_.defaults(state.extraStyle || {}, args.createArgs || {}) 
	) + "), '" + node.nodeName + "', " + (args.parent.symbol || 'null') + ");";

	return {
		parent: {},
		styles: state.styles,
		code: code
	};
};