var _ = require('lodash'),
	styler = require('../styler'),
	U = require('../../../utils'),
	CU = require('../compilerUtils'),
	tiapp = require('../../../tiapp');

exports.parse = function(node, state) {
	return require('./base').parse(node, state, parse);
};

function parse(node, state, args) {
	const platform =  CU.getCompilerConfig().alloyConfig.platform;


	var children = U.XML.getElementsFromNodes(node.childNodes),
		err = ['NavigationWindow must have only one child element, which must be a Window or TabGroup'],
		code = '';

	// NavigationWindow must have 1 window or tabgroup as a child
	if (children.length !== 1) {
		U.die(err);
	}

	var child = children[0],
		childArgs = CU.getParserArgs(child),
		theNode = CU.validateNodeName(child, [ 'Ti.UI.Window', 'Ti.UI.TabGroup' ]),
		windowSymbol;

	// generate the code for the child first
	if (theNode) {
		code += CU.generateNodeExtended(child, state, {
			parent: {},
			post: function(node, state, args) {
				windowSymbol = state.parent.symbol;
			}
		});
	} else {
		err.unshift('Invalid NavigationWindow child "' + childArgs.fullname + '"');
		U.die(err);
	}

	// create NavigationWindow with window
	state.extraStyle = styler.createVariableStyle('window', windowSymbol);
	code += require('./default').parse(node, state).code;

	// Update the parsing state
	return {
		parent: {},
		styles: state.styles,
		code: code
	};
}
