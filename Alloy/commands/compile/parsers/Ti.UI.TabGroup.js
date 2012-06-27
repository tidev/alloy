// TODO: pass errors back to the calling function in the compile
//       command to give more visibility into the error, things like view
//       name, view file, etc...

var _ = require('../../../lib/alloy/underscore')._,
	U = require('../../../utils'),
	CU = require('../compilerUtils');

exports.parse = function(node, state) {
	var args = CU.getParserArgs(node, state),
		children = U.getElementsFromNodes(node.childNodes),
		linePrefix = '\t',
		tabStates = [],
		code = '';

	// Create the initial TabGroup code
	var tabGroupState = require('./default').parse(node, state);
	code += tabGroupState.code;

	// Gotta have at least one Tab
	if (children.length === 0) {
		U.die('TabGroup must have at least one Tab as a child');
	}

	// iterate through all children
	for (var i = 0, l = children.length; i < l; i++) {
		var child = children[i],
			childArgs = CU.getParserArgs(child);

		// Make sure all children are Tabs
		if (childArgs.fullname !== 'Ti.UI.Tab') {
			U.die('All TabGroup children must be of type Ti.UI.Tab. Invalid child at position ' + i);
		}

		// process each Tab and save its state
		var tabState = require('./Ti.UI.Tab').parse(child, tabGroupState);
		tabStates.push(tabState.parent);
		code += tabState.code;
	}

	// Update the parsing state
	return {
		parent: tabStates,
		styles: state.styles,
		code: code
	}
};