var _ = require('../../../lib/alloy/underscore')._,
	styler = require('../styler'),
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
		U.die('SplitWindow must have exactly 2 children that are Windows, a master and detail respectively');
	}

	_.each(children, function(child) {
		var theNode = CU.validateNodeName(child, ['Ti.UI.Window','Ti.UI.TabGroup']);
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
			U.die([
				'Invalid <SplitWindow> child type: ' + childArgs.fullname,
				'<SplitWindow> must have 2 Windows as children'
			]);
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