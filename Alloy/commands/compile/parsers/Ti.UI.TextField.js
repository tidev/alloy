var styler = require('../styler'),
	CU = require('../compilerUtils'),
	U = require('../../../utils');

exports.parse = function(node, state) {
	return require('./base').parse(node, state, parse);
};

function parse(node, state, args) {
	// convert clearOnEdit to a boolean
	if (node.hasAttribute('clearOnEdit')) {
		var attr = node.getAttribute('clearOnEdit');
		state.extraStyle = styler.createVariableStyle('clearOnEdit', attr === 'true');
	}

	// Generate runtime code using default
	return require('./default').parse(node, state);
};