var styler = require('../styler'),
	CU = require('../compilerUtils'),
	U = require('../../../utils');

// regex for ALOY-895
var BINDING_REGEX = /^\s*\{\s*([^\s]+)\s*\}\s*$/;

var platform = CU.getCompilerConfig().alloyConfig.platform;
var REQUIRES_VALUE = platform === 'ios';

exports.parse = function(node, state) {
	return require('./base').parse(node, state, parse);
};

function parse(node, state, args) {
	if (node.hasAttribute('value')) {
		var value = node.getAttribute('value');
		if(!value.match(BINDING_REGEX)) {
			// coerce value attribute to boolean if the switch is not bound to a collection
			state.extraStyle = styler.createVariableStyle('value', value === 'true');
		}
	} else if (REQUIRES_VALUE) {
		// Workaround for https://jira.appcelerator.org/browse/TIMOB-9007
		state.extraStyle = styler.createVariableStyle('value', false);
	}

	// Generate runtime code using default
	return require('./default').parse(node, state);
}