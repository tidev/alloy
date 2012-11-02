var _ = require('../../../lib/alloy/underscore')._,
	U = require('../../../utils'),
	CU = require('../compilerUtils');

exports.parse = function(node, state) {
	return require('./base').parse(node, state, parse);
};

function parse(node, state, args) {
	var children = U.XML.getElementsFromNodes(node.childNodes),
		arrayName = CU.generateUniqueId(),
		activitySymbol = state.parent.symbol + '.activity',
		eventObject = 'e';

	// TODO: need to assert that the parent is a Ti.UI.Window

	// Start the onCreateOptionsMenu() call
	var code = activitySymbol + '.onCreateOptionsMenu = function(' + eventObject + ') {';

	_.each(U.XML.getElementsFromNodes(node.childNodes), function(child) {
		var childArgs = CU.getParserArgs(child, state);
		var theNode = CU.validateNodeName(child, 'Ti.Android.MenuItem');
		
		// Make sure we are dealing with MenuItems
		if (!theNode) {
			U.die([
				'Invalid child type under <Menu>: ' + childArgs.fullname,
				'<Menu> must have only <MenuItem> elements as children'
			]);
		}

		// generate code for the MenuItem
		code += CU.generateNode(child, {
			parent: { 
				node: node,
				symbol: eventObject + '.menu'
			},
			styles: state.styles
		});
	});

	// close the onCreateOptionsMenu() call
	code += '};';

	// Update the parsing state
	return {
		parent: {},
		styles: state.styles,
		code: code
	}
};