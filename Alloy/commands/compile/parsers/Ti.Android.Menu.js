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

	// iterate through all children
	for (var i = 0, l = children.length; i < l; i++) {
		var child = children[i],
			childArgs = CU.getParserArgs(child);

		// make sure we are dealing with MenuItems
		if (childArgs.fullname === 'Alloy.Require') {
			var inspect = CU.inspectRequireNode(child);
			_.each(inspect.names, function(name) {
				if (name !== 'Ti.Android.MenuItem') {
					U.die('Menu <Require> child at position ' + i + ' has elements that are not MenuItems.');
				}
			});
		} else if (childArgs.fullname !== 'Ti.Android.MenuItem') {
			U.die('Menu child at position ' + i + ' is not a MenuItem, or a <Require> containing MenuItems.');
		}

		// generate code for the MenuItem
		code += CU.generateNode(child, {
			parent: { 
				node: node,
				symbol: eventObject + '.menu'
			},
			styles: state.styles
		});
	}

	// close the onCreateOptionsMenu() call
	code += '};';

	// Update the parsing state
	return {
		parent: {},
		styles: state.styles,
		code: code
	}
};