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
		U.die('SplitWindow must have exactly 2 children that are Windows, a master and detail respectively');
	}

	_.each(children, function(child) {
		var theNode = CU.validateNodeName(child, 'Ti.UI.Window');
		var childArgs = CU.getParserArgs(child);
		if (theNode) {
			code += CU.generateNodeExtended(child, state, {
				parent: {},
				post: function(node, state, args) {
					subParents.push(state.parent.symbol);
				}
			});
		} else {
			U.die([
				'Invalid <SplitWindow> child type: ' + childArgs.fullname,
				'<SplitWindow> must have 2 Windows as children'
			]);
		}
	});

	// The first window is the master, the second window is the detail
	state.extraStyle = CU.createVariableStyle([
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
	} 
};