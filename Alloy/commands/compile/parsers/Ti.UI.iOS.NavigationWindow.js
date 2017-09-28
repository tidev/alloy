var _ = require('../../../lib/alloy/underscore')._,
	styler = require('../styler'),
	U = require('../../../utils'),
	CU = require('../compilerUtils'),
	tiapp = require('../../../tiapp');

var MIN_VERSION = '3.1.3';

exports.parse = function(node, state) {
	return require('./base').parse(node, state, parse);
};

function parse(node, state, args) {
	if (tiapp.version.lt(tiapp.getSdkVersion(), MIN_VERSION)) {
		U.die('Ti.UI.iOS.NavigationWindow (line ' + node.lineNumber + ') requires Titanium 3.1.3+');
	}

	var children = U.XML.getElementsFromNodes(node.childNodes),
		err = ['NavigationWindow must have only one child element, which must be a Window'],
		code = '';

	// NavigationWindow must have 1 window as a child
	if (children.length !== 1) {
		U.die(err);
	}

	var child = children[0],
		childArgs = CU.getParserArgs(child),
		theNode = CU.validateNodeName(child, 'Ti.UI.Window'),
		windowSymbol;

	// generate the code for the Window first
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