var styler = require('../styler'),
	CU = require('../compilerUtils'),
	U = require('../../../utils');

var platform = CU.getCompilerConfig().alloyConfig.platform;
var REQUIRES_VALUE = platform === 'ios';

exports.parse = function(node, state) {
	return require('./base').parse(node, state, parse);
};

function parse(node, state, args) {
	// coerce value attribute to boolean for all platforms
	if (node.hasAttribute('value')) {
		state.extraStyle = styler.createVariableStyle('value', node.getAttribute('value') === 'true');
	}
	else if (REQUIRES_VALUE) {
		// Workaround for https://jira.appcelerator.org/browse/TIMOB-9007
		state.extraStyle = styler.createVariableStyle('value', false);
	}

	// Generate runtime code using default
	return require('./default').parse(node, state);
}