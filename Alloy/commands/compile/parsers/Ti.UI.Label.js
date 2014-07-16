var styler = require('../styler'),
	CU = require('../compilerUtils'),
	U = require('../../../utils');

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
			state.extraStyle = styler.createVariableStyle('text', "'" + U.trim(nodeText.replace(/'/g, "\\'")) + "'");
		}

		if (nodeText.match(/\{([^}]+)\}/) !== null) {
			state.extraStyle["text"] = nodeText;
		}
	}

	// Generate runtime code using default
	return require('./default').parse(node, state);
}
