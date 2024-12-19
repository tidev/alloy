var _ = require('lodash'),
	styler = require('../styler'),
	U = require('../../../utils'),
	CU = require('../compilerUtils'),
	tiapp = require('../../../tiapp');

exports.parse = function(node, state) {
	return require('./base').parse(node, state, parse);
};

function parse(node, state, args) {

	// Get label text from node text, if present
	var nodeText = U.XML.getNodeText(node);
	if (nodeText) {
		if (U.isLocaleAlias(nodeText)) {
			state.extraStyle = {'text': styler.STYLE_EXPR_PREFIX + nodeText};
		} else {
			state.extraStyle = styler.createVariableStyle('text', U.possibleMultilineString(U.trim(nodeText.replace(/'/g, "\\'"))));
		}

		if (nodeText.match(/\{([^}]+)\}/) !== null) {
			state.extraStyle = nodeText;
		}
	}

	var nodeState = require('./default').parse(node, state);
	delete state.extraStyle;

	var code = nodeState.code;

	return {
		parent: {
			node: node,
			symbol: args.symbol
		},
		code: code
	};
}
