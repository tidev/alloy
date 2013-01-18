var _ = require('../../../lib/alloy/underscore')._,
	U = require('../../../utils'),
	CU = require('../compilerUtils');

exports.parse = function(node, state) {
	return require('./base').parse(node, state, parse);
};

// TODO: Improve effeciency https://jira.appcelerator.org/browse/ALOY-265
function parse(node, state, args) {
	var children = U.XML.getElementsFromNodes(node.childNodes),
		errBase = 'All <Picker> children must be either columns or rows. '
		arrayName = CU.generateUniqueId(),
		code = '';

	// Create the initial Picker code
	code += require('./default').parse(node, state).code;

	// iterate through all children
	var foundColumn = false;
	var foundRow = false;
	for (var i = 0, l = children.length; i < l; i++) {
		var child = children[i],
			childArgs = CU.getParserArgs(child),
			err = errBase + ' Invalid child at position ' + i;

		// Validate that each child is a column or row
		// TODO: Handle <Require> https://jira.appcelerator.org/browse/ALOY-266
		if (childArgs.fullname === 'Ti.UI.PickerColumn' ||
			(childArgs.name === 'Column' && !child.getAttribute('ns'))) {
			foundColumn = true;
			if (foundRow) {
				U.die([
					err,
					'You can\'t mix columns an rows as children of <Picker>'
				]);
			}
			child.nodeName = 'PickerColumn';
		} else if (childArgs.fullname === 'Ti.UI.PickerRow' ||
			(childArgs.name === 'Row' && !child.getAttribute('ns'))) {
			foundRow = true;
			if (foundColumn) {
				U.die([
					err,
					'You can\'t mix columns an rows as children of <Picker>'
				]);
			}
			child.nodeName = 'PickerRow';
		} else {
			U.die(err);
		}

		// generate the code for each column/row and add it to the array
		code += CU.generateNodeExtended(child, state, {
			parent: {},
			post: function(node, state, a) {
				if (foundRow) {
					return arrayName + '.push(' + state.parent.symbol + ');\n';
				} else {
					return args.symbol + '.add(' + state.parent.symbol + ');\n';
				}
			}
		});
	}

	// add the array of columns/rows to the Picker, if necessary
	if (foundRow) {
		code = 'var ' + arrayName + ' = [];\n' + code;
		code += args.symbol + '.add(' + arrayName + ');\n';
	}	

	// Update the parsing state
	return {
		parent: {},
		styles: state.styles,
		code: code
	};
};