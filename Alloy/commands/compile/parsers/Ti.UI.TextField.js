var _ = require('../../../lib/alloy/underscore')._,
	styler = require('../styler'),
	U = require('../../../utils'),
	CU = require('../compilerUtils'),
	CONST = require('../../../common/constants');

exports.parse = function(node, state) {
	return require('./base').parse(node, state, parse);
};

function parse(node, state, args) {
	var code = '',
		postCode = '',
		extras = [],
		proxyProperties = {};

	// iterate through all children of the TextField
	_.each(U.XML.getElementsFromNodes(node.childNodes), function(child) {
		var fullname = CU.getNodeFullname(child),
			isProxyProperty = false,
			isControllerNode = false,
			hasUiNodes = false,
			controllerSymbol, parentSymbol;

		// validate the child element and determine if it's part of
		// the textfield or a proxy property assigment
		if (!CU.isNodeForCurrentPlatform(child)) {
			return;
		} else if (_.contains(CONST.CONTROLLER_NODES, fullname)) {
			isControllerNode = true;
		} else if (fullname.split('.')[0] === '_ProxyProperty') {
			isProxyProperty = true;
		}

		// generate the node
		code += CU.generateNodeExtended(child, state, {
			parent: {},
			post: function(node, state, args) {
				controllerSymbol = state.controller;
				parentSymbol = state.parent ? state.parent.symbol : null;
			}
		});

		// manually handle controller node proxy properties
		if (isControllerNode) {

			// set up any proxy properties at the top-level of the controller
			var inspect = CU.inspectRequireNode(child);
			_.each(_.uniq(inspect.names), function(name) {
				if (name.split('.')[0] === '_ProxyProperty') {
					var prop = U.proxyPropertyNameFromFullname(name);
					proxyProperties[prop] = controllerSymbol + '.getProxyPropertyEx("' + prop + '", {recurse:true})';
				} else {
					hasUiNodes = true;
				}
			});
		}

		// generate code for proxy property assignments
		if (isProxyProperty) {
			proxyProperties[U.proxyPropertyNameFromFullname(fullname)] = parentSymbol;

		// generate code for the child components
		} else if (hasUiNodes || !isControllerNode) {
			postCode += '<%= parentSymbol %>.add(' + parentSymbol + ');';
		}

	});

	// add all creation time properties to the state
	if (node.hasAttribute('clearOnEdit')) {
		var attr = node.getAttribute('clearOnEdit');
		extras.push(['clearOnEdit', attr === 'true']);
	}
	_.each(proxyProperties, function(v, k) {
		extras.push([k, v]);
	});
	if (extras.length) { state.extraStyle = styler.createVariableStyle(extras); }

	// generate the code for the textfield itself
	var nodeState = require('./default').parse(node, state);
	code += nodeState.code;

	// add the rows to the section
	if (postCode) {
		code += _.template(postCode, {
			parentSymbol: nodeState.parent.symbol
		});
	}

	// Update the parsing state
	return _.extend(state, {
		parent: {},
		code: code
	});
}
