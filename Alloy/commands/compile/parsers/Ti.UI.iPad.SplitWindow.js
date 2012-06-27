// TODO: pass errors back to the calling function in the compile
//       command to give more visibility into the error, things like view
//       name, view file, etc...

var _ = require('../../../lib/alloy/underscore')._,
	U = require('../../../utils'),
	CU = require('../compilerUtils');

exports.parse = function(node, state) {
	var args = CU.getParserArgs(node, state),
		children = U.XML.getElementsFromNodes(node.childNodes),
		linePrefix = '\t',
		subParents = [],
		code = '';

	// SplitWindow must have 2 windows as children
	if (children.length !== 2) {
		U.die('SplitWindow must have exactly 2 children that are Windows');
	}

	// iterate through all children
	for (var i = 0, l = children.length; i < l; i++) {
		var child = children[i],
			childArgs = CU.getParserArgs(child);

		// Make sure we are dealing with Windows
		if (childArgs.fullname !== 'Ti.UI.Window') {
			U.die('SplitWindow child at position ' + i + ' is not a Window');
		}

		// create the code for the window
		var winState = require('./default').parse(child, CU.createEmptyState(state.styles));
		subParents.push(winState.parent);
		code += winState.code;
	}

	// For now, we will assume the first window is the master, the second 
	// window is the detail. There are a few different ways we could handle this:
	// Check this for details: https://jira.appcelerator.org/browse/ALOY-80
	var extraStyle = CU.createVariableStyle([
		['masterView', subParents[0].symbol],
		['detailView', subParents[1].symbol]
	]);
	var splitState = require('./default').parse(node, state, extraStyle);
	code += splitState.code;

	// Update the parsing state
	return {
		parent: subParents,
		styles: state.styles,
		code: code
	} 
};