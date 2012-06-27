// TODO: pass errors back to the calling function in the compile
//       command to give more visibility into the error, things like view
//       name, view file, etc...

var _ = require('../../../lib/alloy/underscore')._,
	U = require('../../../utils'),
	CU = require('../compilerUtils');

exports.parse = function(node, state) {
	var args = CU.getParserArgs(node, state),
		parentArgs = {},
		rawChildren = node.childNodes,
		linePrefix = '\t',
		tabStates = [],
		code = '',
		children = [];

	// create array of children elements
	for (var i = 0, l = rawChildren.length; i < l; i++) {
		if (rawChildren.item(i).nodeType === 1) {
			children.push(rawChildren.item(i));
		}
	}

	// Make sure the parent is TabGroup
	if (args.parent.node) {
		parentArgs = CU.getParserArgs(args.parent.node);
	}
	if (parentArgs.fullname !== 'Ti.UI.TabGroup') {
		U.die('Tab must have a TabGroup as a parent');
	}

	// See if the only child is a Window. If not, add it
	var winState;
	var createEmptyState = function() {
		return {
			parent: {},
			styles: state.styles
		}
	};

	// Generate the code for the Window contained in the Tab
	var winNode;
	if (children.length !== 1 ||
		CU.getParserArgs(children[0]).fullname !== 'Ti.UI.Window') {
		winNode = U.XML.createEmptyNode('Window');
		for (var i = 0; i < children.length; i++) {
			winNode.appendChild(children[i]);
			node.removeChild(children[i]);
		}
		node.appendChild(winNode);
	} 

	// Generate code for Tab's Window
	// TODO: children[0] needs to be something else in the case of creating Window
	winState = require('./default').parse(winNode || children[0], createEmptyState());
	code += winState.code;

	// Generate the code for the Tab itself, with the Window in it
	var tabState = require('./default').parse(
		node, 
		createEmptyState(), 
		{ window: { value:winState.parent.symbol, alloyType:'var' } }
	);
	code += tabState.code;

	// Generate code that adds this Tab to its parent TabGroup
	code += linePrefix + state.parent.symbol + '.addTab(' + tabState.parent.symbol + ');\n';

	// Update the parsing state
	return {
		parent: {
			node: winState.parent.node,
			symbol: winState.parent.symbol
		},
		styles: state.styles,
		code: code
	}
};