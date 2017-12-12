var _ = require('lodash'),
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
		var fullname = CU.getNodeFullname(child),
			theNode = CU.validateNodeName(child, ALL_VALID),
			isProxyProperty = false,
			isControllerNode = false,
			hasUiNodes = false,
			parentSymbol, controllerSymbol;

		// validate the child element and determine if it's part of
		// the table data or a proxy property assigment
		if (!theNode) {
			U.dieWithNode(child, 'Ti.UI.TableView child elements must be one of the following: [' + ALL_VALID.join(',') + ']');
		} else if (!CU.isNodeForCurrentPlatform(child)) {
			return;
		} else if (_.includes(CONST.CONTROLLER_NODES, fullname)) {
			isControllerNode = true;
		} else if (_.includes(PROXY_PROPERTIES, theNode)) {
			isProxyProperty = true;
		}

		// manually handle controller node proxy properties
		if (isControllerNode) {

			// generate the controller node
			code += CU.generateNodeExtended(child, state, {
				parent: {},
				post: function(node, state, args) {
					parentSymbol = state.parent.symbol;
					controllerSymbol = state.controller;
				}
			});

			// set up any proxy properties at the top-level of the controller
			var inspect = CU.inspectRequireNode(child);
			_.each(_.uniq(inspect.names), function(name) {
				if (_.includes(PROXY_PROPERTIES, name)) {
					var prop = U.proxyPropertyNameFromFullname(name);
					proxyProperties[prop] = controllerSymbol + '.getProxyPropertyEx("' + prop + '", {recurse:true})';
				} else {
					hasUiNodes = true;
				}
			});

			if (hasUiNodes) {
				rowCode += '<%= sectionSymbol %>.add(' + parentSymbol + ');';
			}
		}

		// generate code for proxy property assignments
		if (isProxyProperty) {
			code += CU.generateNodeExtended(child, state, {
				parent: {},
				post: function(node, state, args) {
					proxyProperties[U.proxyPropertyNameFromFullname(theNode)] = state.parent.symbol;
				}
			});

		// generate code for the static row
		} else if (!isControllerNode) {
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
		code += _.template(rowCode)({
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
