var _ = require('../../../lib/alloy/underscore')._,
	U = require('../../../utils'),
	CU = require('../compilerUtils'),
	CONST = require('../../../common/constants');

var ROWS = [
	'Ti.UI.Row',
	'Ti.UI.PickerRow'
];

exports.parse = function(node, state) {
	return require('./base').parse(node, state, parse);
};

function parse(node, state, args) {
	var code = require('./default').parse(node, state).code;

	// iterate through all children
	_.each(U.XML.getElementsFromNodes(node.childNodes), function(child) {
		var theNode = CU.validateNodeName(child, ROWS),
			isControllerNode = _.contains(CONST.CONTROLLER_NODES, CU.getNodeFullname(child));

		// make sure it's a valid node
		if (!theNode) {
			U.dieWithNode(child, 'Ti.UI.PickerColumn child elements must be one of the following: [' + ROWS.join(',') + ']');

		// handle rows
		} else if (_.contains(ROWS, theNode) && !isControllerNode) {
			child.nodeName = 'PickerRow';
		}

		// generate the code for each row and add it to the array
		code += CU.generateNodeExtended(child, state, {
			parent: {},
			post: function(node, state, a) {
				return args.symbol + '.addRow(' + state.parent.symbol + ');\n';
			}
		});
	});

	// Update the parsing state
	return {
		parent: {},
		styles: state.styles,
		code: code
	};
}