// TODO: pass errors back to the calling function in the compile
//       command to give more visibility into the error, things like view
//       name, view file, etc...

var _ = require('../../../lib/alloy/underscore')._,
	U = require('../../../utils'),
	CU = require('../compilerUtils');

exports.parse = function(node, state) {
	var args = CU.getParserArgs(node, state),
		parentArgs = {},
		children = node.childNodes,
		linePrefix = '\t',
		tabStates = [],
		code = '';

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
			style: state.style
		}
	};

	// Generate the code for the Window contained in the Tab
	if (children.length !== 1 ||
		CU.getParserArgs(children.item(0)).fullname !== 'Ti.UI.Window') {
		var eNode = U.XML.createEmptyNode('Window');
		for (var i = 0; i < children.length; i++) {
			eNode.appendChild(children.item(i));
			node.removeChild(children.item(i));
		}
		node.appendChild(eNode);
	}

	// Generate code for Tab's Window
	winState = require('./default').parse(node.childNodes.item(0), createEmptyState());
	code += winState.code;

	// Generate the code for the Tab itself, with the Window in it
	var tabState = require('./default').parser(
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