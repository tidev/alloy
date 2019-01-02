var _ = require('lodash'),
	styler = require('../styler'),
	U = require('../../../utils'),
	CU = require('../compilerUtils');

var VALID = ['Ti.UI.Window', 'Ti.UI.TabGroup', 'Ti.UI.iOS.NavigationWindow', 'Ti.UI.NavigationWindow'];

exports.parse = function(node, state) {
	return require('./base').parse(node, state, parse);
};

function parse(node, state, args) {
	var children = U.XML.getElementsFromNodes(node.childNodes),
		subParents = [],
		code = '',
		err = [
			'Ti.UI.iOS.SplitWindow (line ' + node.lineNumber + ') ',
			'Ti.UI.iOS.SplitWindow must have exactly 2 children of one of the following types:',
			'  [' + VALID.join(',') + ']',
			'The first child is the master, the second is the child.'
		];

	// SplitWindow must have 2 windows as children
	if (children.length !== 2) {
		err[0] += ' has ' + children.length + ' child elements';
		U.die(err);
	}

	_.each(children, function(child) {
		var theNode = CU.validateNodeName(child, VALID);
		var childArgs = CU.getParserArgs(child);
		if (theNode) {
			var subParentSymbol;
			code += CU.generateNodeExtended(child, state, {
				parent: {},
				post: function(node, state, args) {
					subParentSymbol = state.parent.symbol;
					subParents.push(subParentSymbol);
				}
			});

			// TODO: workaround for TIMOB-13068
			if (theNode === 'Ti.UI.TabGroup') {
				code += subParentSymbol + '.open();';
			}
		} else {
			err[0] += ' invalid child type "' + childArgs.fullname + '"';
			U.die(err);
		}
	});

	// The first window is the master, the second window is the detail
	state.extraStyle = styler.createVariableStyle([
		['masterView', subParents[0]],
		['detailView', subParents[1]]
	]);
	var splitState = require('./default').parse(node, state);
	code += splitState.code;

	// Update the parsing state
	return {
		parent: {},
		styles: state.styles,
		code: code
	};
}
