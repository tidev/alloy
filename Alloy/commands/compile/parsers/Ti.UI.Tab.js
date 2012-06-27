// TODO: pass errors back to the calling function in the compile
//       command to give more visibility into the error, things like view
//       name, view file, etc...

var _ = require('../../../lib/alloy/underscore')._,
	U = require('../../../utils'),
	CU = require('../compilerUtils');

exports.parse = function(node, state) {
	var args = CU.getParserArgs(node, state),
		children = U.XML.getElementsFromNodes(node.childNodes),
		parentArgs = {},
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

	// See if the only child is a Window. If not, add it as a container
	// component for all the Tab's children
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
	var winState = require('./default').parse(winNode || children[0], CU.createEmptyState(state.styles));
	code += winState.code;

	// Generate the code for the Tab itself, with the Window in it
	var extraStyle = { window: { value: winState.parent.symbol } };
	extraStyle.window[CU.STYLE_ALLOY_TYPE] = 'var';
	var tabState = require('./default').parse(
		node, 
		CU.createEmptyState(state.styles), 
		extraStyle
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