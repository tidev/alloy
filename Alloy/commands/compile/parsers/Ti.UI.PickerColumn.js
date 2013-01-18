var _ = require('../../../lib/alloy/underscore')._,
	U = require('../../../utils'),
	CU = require('../compilerUtils');

exports.parse = function(node, state) {
	return require('./base').parse(node, state, parse);
};

function parse(node, state, args) {
	var children = U.XML.getElementsFromNodes(node.childNodes),
		errBase = 'All <PickerColumn> children must be rows. '
		code = '';

	// Create the initial PickerColumn code
	code += require('./default').parse(node, state).code;

	// iterate through all children
	for (var i = 0, l = children.length; i < l; i++) {
		var child = children[i],
			childArgs = CU.getParserArgs(child),
			err = errBase + ' Invalid child at position ' + i;

		// Validate that each child is a row
		// TODO: Handle <Require>
		if (childArgs.fullname === 'Ti.UI.PickerRow' ||
			(childArgs.name === 'Row' && !child.getAttribute('ns'))) {
			child.nodeName = 'PickerRow';
		} else {
			U.die(err);
		}

		// generate the code for each row and add it to the array
		code += CU.generateNodeExtended(child, state, {
			parent: {},
			post: function(node, state, a) {
				return args.symbol + '.addRow(' + state.parent.symbol + ');\n';
			}
		});
	}

	// Update the parsing state
	return {
		parent: {},
		styles: state.styles,
		code: code
	};
};