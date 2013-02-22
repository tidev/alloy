var _ = require('../../../lib/alloy/underscore')._,
	CU = require('../compilerUtils'),
	U = require('../../../utils');

exports.parse = function(node, state) {
	return require('./base').parse(node, state, parse);
};

function parse(node, state, args) {
	var code = '';

	var cond = node.getAttribute('cond');

	if (cond)
	{
		code+='if (' + cond + '){\n';
	}

	// the platform,formFactor,etc checks comes for free since the base handles it

	_.each(U.XML.getElementsFromNodes(node.childNodes), function(child) {
		var childArgs = CU.getParserArgs(child, state);
		code += CU.generateNodeExtended(child, state, {
				parent: {
					node: state.parent,
					symbol: state.parent.symbol
				}
			});
	});

	if (cond)
	{
		code+='}\n';
	}

	return {
		parent: {},
		styles: state.styles,
		code: code
	}
};