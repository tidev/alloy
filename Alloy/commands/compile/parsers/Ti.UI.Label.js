var CU = require('../compilerUtils'),
	U = require('../../../utils');

exports.parse = function(node, state) {
	// Get label text from node text, if present
	var args = CU.getParserArgs(node, state),
		nodeText = U.XML.getNodeText(node);
	if (nodeText) {
		state.styles = CU.addStyleById(state.styles, args.id, 'text', nodeText);
	}

	// Generate runtime code using default
	return require('./default').parse(node, state);
};