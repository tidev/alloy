var _ = require('../../../lib/alloy/underscore')._,
	U = require('../../../utils'),
	logger = require('../../../logger'),
	CU = require('../compilerUtils'),
	CONST = require('../../../common/constants'),
	styler = require('../styler');

var ROWS = [
	'Ti.UI.Row',
	'Ti.UI.PickerRow',
];
var COLUMNS = [
	'Ti.UI.Column',
	'Ti.UI.PickerColumn',
];
var VALID = _.union(ROWS, COLUMNS);
var DATETIMETYPES = [
	'Ti.UI.PICKER_TYPE_DATE',
	'Ti.UI.PICKER_TYPE_TIME',
	'Ti.UI.PICKER_TYPE_DATE_AND_TIME',
	'Ti.UI.PICKER_TYPE_COUNT_DOWN_TIMER',
	'Titanium.UI.PICKER_TYPE_DATE',
	'Titanium.UI.PICKER_TYPE_TIME',
	'Titanium.UI.PICKER_TYPE_DATE_AND_TIME',
	'Titanium.UI.PICKER_TYPE_COUNT_DOWN_TIMER'
];

exports.parse = function(node, state) {
	return require('./base').parse(node, state, parse);
};


// TODO: Improve effeciency https://jira.appcelerator.org/browse/ALOY-265
function parse(node, state, args) {
	var children = U.XML.getElementsFromNodes(node.childNodes),
		errBase = 'All <Picker> children must be either columns or rows. ',
		code = '', arrayName,
		extras = [];

	// ALOY-263, support date/time type pickers
	if (node.hasAttribute('type') && _.contains(DATETIMETYPES, node.getAttribute('type'))) {
		// We have a date or time type picker so cast the string values to date objects
		var d;
		if(node.hasAttribute('value')) {
			d = U.createDate(node.getAttribute('value'));
			if(U.isValidDate(d, 'value')) {
				extras.push(['value', 'new Date("'+d.toString()+'")']);
			}
		}
		if(node.hasAttribute('minDate')) {
			d = U.createDate(node.getAttribute('minDate'));
			if(U.isValidDate(d, 'minDate')) {
				extras.push(['minDate', 'new Date("'+d.toString()+'")']);
			}
		}
		if(node.hasAttribute('maxDate')) {
			d = U.createDate(node.getAttribute('maxDate'));
			if(U.isValidDate(d, 'maxDate')) {
				extras.push(['maxDate', 'new Date("'+d.toString()+'")']);
			}
		}
		// Then, handle a couple of boolean date/time related attributes
		attr = node.getAttribute('format24');
		extras.push(['format24', attr === 'true']);
		attr = node.getAttribute('calendarViewShown');
		extras.push(['calendarViewShown', attr === 'true']);
		// Finally, add all the new attributes/properties
		if (extras.length) { state.extraStyle = styler.createVariableStyle(extras); }
	}

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