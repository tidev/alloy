var _ = require('../../../lib/alloy/underscore')._,
	styler = require('../styler'),
	U = require('../../../utils'),
	CU = require('../compilerUtils'),
	CONST = require('../../../common/constants');

var PROXY_PROPERTIES = [
	'_ProxyProperty._Lists.HeaderView',
	'_ProxyProperty._Lists.FooterView'
];
var VALID = [
	'Ti.UI.TableViewRow'
];
var ALL_VALID = _.union(PROXY_PROPERTIES, VALID);

exports.parse = function(node, state) {
	return require('./base').parse(node, state, parse);
};

function parse(node, state, args) {
	var code = '',
		rowCode = '',
		extras = [],
		proxyProperties = {};

	// iterate through all children of the TableView
	_.each(U.XML.getElementsFromNodes(node.childNodes), function(child) {
		var childArgs = CU.getParserArgs(child);

		// validate the child element and determine if it's part of
		// the table data, a searchbar, or a proxy property assigment
		var theNode = CU.validateNodeName(child, ALL_VALID);
		if (!theNode) {
			U.dieWithNode(child, 'Ti.UI.TableViewSection child elements must be one of the following: [' + ALL_VALID.join(',') + ']');
		}

		// generate code for proxy property assignments
		if (_.contains(PROXY_PROPERTIES, theNode)) {
			if (!CU.isNodeForCurrentPlatform(child)) {
				return;
			}
			var nameParts = theNode.split('.');
			var prop = U.lcfirst(nameParts[nameParts.length-1]);
			code += CU.generateNodeExtended(child, state, {
				parent: {},
				post: function(node, state, args) {
					proxyProperties[prop] = state.parent.symbol;
				}
			});

		// generate code for the static row
		} else {
			rowCode += CU.generateNodeExtended(child, state, {
				parent: {},
				post: function(node, state, args) {
					return '<%= sectionSymbol %>.add(' + state.parent.symbol + ');';
				}
			});
		}
	});

	// add all creation time properties to the state
	_.each(proxyProperties, function(v, k) {
		extras.push([k, v]);
	});
	if (extras.length) { state.extraStyle = styler.createVariableStyle(extras); }

	// generate the code for the section itself
	var tableState = require('./default').parse(node, state);
	code += tableState.code;

	// add the rows to the section
	if (rowCode) {
		code += _.template(rowCode, {
			sectionSymbol: tableState.parent.symbol
		});
	}

	// Update the parsing state
	return {
		parent: {},
		styles: state.styles,
		code: code
	};
}
