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
	var isDataBound = args[CONST.BIND_COLLECTION] ? true : false,
		localModel,
		rowCode = "";

	// generate the code for the table itself
	if (isDataBound) {
		_.each(CONST.BIND_PROPERTIES, function(p) {
			node.removeAttribute(p);
		});
	}
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

		// generate data binding code
		if (isDataBound) {
			localModel = localModel || CU.generateUniqueId();
			rowCode += CU.generateNodeExtended(child, state, {
				parent: {},
				model: localModel,
				post: function(node, state, args) {
					return 'rows.push(' + state.parent.symbol + ');\n';
				}
			});
		// standard row processing
		} else {

			// generate the code for each row and add it to the array
			code += CU.generateNodeExtended(child, state, {
				parent: {},
				post: function(node, state, a) {
					return args.symbol + '.addRow(' + state.parent.symbol + ');\n';
				}
			});
		}
	});

	// finally, fill in any model-view binding code, if present
	if (isDataBound) {
		localModel = localModel || CU.generateUniqueId();
		if(state.parentFormFactor || node.hasAttribute('formFactor')) {
			// if this node or a parent has set the formFactor attribute
			// we need to pass it to the data binding generator
			args.parentFormFactor = (state.parentFormFactor || node.getAttribute('formFactor'));
		}
		code += _.template(CU.generateCollectionBindingTemplate(args), {
			localModel: localModel,
			pre: "var rows=[];\n_.each(" + args.symbol + ".getRows(), function(r) { " + args.symbol + ".removeRow(r);});\n",
			items: rowCode,
			post: "_.each(rows, function(row) { " + args.symbol + ".addRow(row); });"
		});
	}

	// Update the parsing state
	return {
		parent: {},
		styles: state.styles,
		code: code
	};
}