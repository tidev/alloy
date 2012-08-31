var CU = require('../compilerUtils');

exports.parse = function(node, state) {
	return require('./base').parse(node, state, parse);
};

function parse(node, state, args) {
	var latitude = node.getAttribute('latitude'),
		longitude = node.getAttribute('longitude'),
		extraStyle = [];

	if (latitude) { extraStyle.push(['latitude', parseFloat(latitude)]); }
	if (longitude) { extraStyle.push(['longitude', parseFloat(longitude)]); }
	if (extraStyle.length > 0) {
		state.extraStyle = CU.createVariableStyle(extraStyle);
	}

	var code = require('./default').parse(node, {
		parent: {},
		styles: state.styles
	}).code;

	return { 
		parent: {
			node: node,
			symbol: args.symbol
		},
		styles: state.styles,
		code: code
	};
};