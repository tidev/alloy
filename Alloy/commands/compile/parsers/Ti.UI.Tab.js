var _ = require('lodash')._,
	styler = require('../styler'),
	U = require('../../../utils'),
	CU = require('../compilerUtils');

exports.parse = function(node, state) {
	return require('./base').parse(node, state, parse);
};

function parse(node, state, args) {
	var children = U.XML.getElementsFromNodes(node.childNodes),
		err = ['Tab must have only one child element, which must be a Window'],
		code = '';

	// Tab must have 1 window as a child
	if (children.length !== 1) {
		U.die(err);
	}

	var child = children[0],
		childArgs = CU.getParserArgs(child),
		theNode = CU.validateNodeName(child, ['Ti.UI.Window', 'Ti.UI.NavigationWindow', 'Ti.UI.iOS.SplitWindow', 'Ti.UI.iOS.NavigationWindow']),
		windowSymbol;

	// generate the code for the Window first
	if (theNode) {
		code += CU.generateNodeExtended(child, state, {
			parent: {},
			insideContainer: true,
			post: function(node, state, args) {
				windowSymbol = state.parent.symbol;
			}
		});
	} else {
		err.unshift('Invalid Tab child "' + childArgs.fullname + '"');
		U.die(err);
	}

	// create tab with window
	state.extraStyle = styler.createVariableStyle('window', windowSymbol);
	code += require('./default').parse(node, state).code;

	// Update the parsing state
	return {
		parent: {},
		styles: state.styles,
		code: code
	};
}
