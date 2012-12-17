var _ = require('../../../lib/alloy/underscore')._,
	U = require('../../../utils'),
	CU = require('../compilerUtils');

exports.parse = function(node, state) {
	return require('./base').parse(node, state, parse);
};

function parse(node, state, args) {
	var code = '';

	// Create the initial TabGroup code
	var groupState = require('./default').parse(node, state);
	code += groupState.code;

	_.each(U.XML.getElementsFromNodes(node.childNodes), function(child) {
		var theNode = CU.validateNodeName(child, 'Ti.UI.Tab');
		if (theNode) {
			code += CU.generateNodeExtended(child, state, {
				parent: {},
				post: function(node, state, args) {
					return groupState.parent.symbol + '.addTab(' + state.parent.symbol + ');';
				}
			});
		} else {
			U.die([
				'Invalid <TabGroup> child type: ' + CU.getNodeFullname(child),
				'All <TabGroup> children must be <Tab>'
			]);
		}
	});

	// Update the parsing state
	return {
		parent: {},
		styles: state.styles,
		code: code
	}
};