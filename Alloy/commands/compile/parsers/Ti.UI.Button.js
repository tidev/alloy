var CU = require('../compilerUtils'),
	U = require('../../../utils');

exports.parse = function(node, state) {
	return require('./base').parse(node, state, parse);
};

function parse(node, state, args) {
	// Get button title from node text, if present
	var nodeText = U.XML.getNodeText(node);
	if (nodeText) {
		state.extraStyle = CU.createVariableStyle('title', "'" + U.trim(nodeText.replace(/'/g, "\\'")) + "'");
	}

	// Generate runtime code using default
	return require('./default').parse(node, state);
};