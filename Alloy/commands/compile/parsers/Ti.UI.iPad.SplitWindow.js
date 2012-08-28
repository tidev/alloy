var _ = require('../../../lib/alloy/underscore')._,
	U = require('../../../utils'),
	CU = require('../compilerUtils');

exports.parse = function(node, state) {
	return require('./base').parse(node, state, parse);
};

function parse(node, state, args) {
	var children = U.XML.getElementsFromNodes(node.childNodes),
		subParents = [],
		code = '';

	// SplitWindow must have 2 windows as children
	if (children.length !== 2) {
		U.die('SplitWindow must have exactly 2 children that are Windows');
	}

	// iterate through all children
	for (var i = 0, l = children.length; i < l; i++) {
		var child = children[i],
			childArgs = CU.getParserArgs(child),
			parserType;

		switch(childArgs.fullname) {
			case 'Alloy.Require':
				// TODO: ensure <Require> is actually a Window - https://jira.appcelerator.org/browse/ALOY-214
				parserType = 'Alloy.Require';
				break;
			case 'Ti.UI.Window':
				parserType = 'default';
				break;
			default:
				U.die('SplitWindow child at position ' + i + ' is not a Window');
				break;
		}

		// create the code for the window
		var winState = require('./' + parserType).parse(child, CU.createEmptyState(state.styles));
		subParents.push(winState.parent);
		code += winState.code;
	}

	// For now, we will assume the first window is the master, the second 
	// window is the detail. There are a few different ways we could handle this:
	// Check this for details: https://jira.appcelerator.org/browse/ALOY-80
	state.extraStyle = CU.createVariableStyle([
		['masterView', subParents[0].symbol],
		['detailView', subParents[1].symbol]
	]);
	var splitState = require('./default').parse(node, state);
	code += splitState.code;

	// Update the parsing state
	return {
		parent: subParents,
		styles: state.styles,
		code: code
	} 
};