var _ = require('../../../lib/alloy/underscore')._,
	U = require('../../../utils'),
	CU = require('../compilerUtils'),
	CONST = require('../../../common/constants');

var ROWS = [
	'Ti.UI.Row',
	'Ti.UI.PickerRow',
];
var COLUMNS = [
	'Ti.UI.Column',
	'Ti.UI.PickerColumn',
];
var VALID = _.union(ROWS, COLUMNS);

exports.parse = function(node, state) {
	return require('./base').parse(node, state, parse);
};

// TODO: Improve effeciency https://jira.appcelerator.org/browse/ALOY-265
function parse(node, state, args) {
	var children = U.XML.getElementsFromNodes(node.childNodes),
		errBase = 'All <Picker> children must be either columns or rows. ',
		code = '', arrayName;

	// Create the initial Picker code
	code += require('./default').parse(node, state).code;

	// iterate through all children
	var foundColumn = false;
	var foundRow = false;
	for (var i = 0, l = children.length; i < l; i++) {
		var child = children[i],
			err = errBase + ' Invalid child at position ' + i,
			theNode = CU.validateNodeName(child, VALID),
			isControllerNode = _.contains(CONST.CONTROLLER_NODES, CU.getNodeFullname(child));

		// make sure it's a valid node
		if (!theNode) {
			U.dieWithNode(child, 'Ti.UI.Picker child elements must be one of the following: [' + VALID.join(',') + ']');

		// handle columns
		} else if (_.contains(COLUMNS, theNode)) {
			foundColumn = true;
			if (foundRow) {
				U.die([
					err,
					'You can\'t mix columns an rows as children of <Picker>'
				]);
			}
			!isControllerNode && (child.nodeName = 'PickerColumn');

		// handle rows
		} else if (_.contains(ROWS, theNode)) {
			foundRow = true;
			if (foundColumn) {
				U.die([
					err,
					'You can\'t mix columns an rows as children of <Picker>'
				]);
			}
			!isControllerNode && (child.nodeName = 'PickerRow');
		}

		// create an array to hold the row/column, if necessary
		if (!arrayName) {
			arrayName = CU.generateUniqueId();
			code += 'var ' + arrayName + '=[];';
		}

		// generate the code for each column/row and add it to the array
		code += CU.generateNodeExtended(child, state, {
			parent: {},
			post: function(node, state, a) {
				return arrayName + '.push(' + state.parent.symbol + ');\n';
			}
		});
	}

	// add the array of columns/rows to the Picker, if necessary
	if (arrayName) {
		code += args.symbol + '.add(' + arrayName + ');\n';
	}

	// Update the parsing state
	return {
		parent: {},
		styles: state.styles,
		code: code
	};
}