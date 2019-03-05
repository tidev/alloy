var _ = require('lodash'),
	styler = require('../styler'),
	U = require('../../../utils'),
	CU = require('../compilerUtils'),
	CONST = require('../../../common/constants');

var KEYBOARD_TYPES = [
	'DEFAULT', 'ASCII', 'NUMBERS_PUNCTUATION', 'URL', 'EMAIL', 'DECIMAL_PAD', 'NAMEPHONE_PAD',
	'NUMBER_PAD', 'PHONE_PAD'
];
var RETURN_KEY_TYPES = [
	'DEFAULT', 'DONE', 'EMERGENCY_CALL', 'GO', 'GOOGLE', 'JOIN', 'NEXT', 'ROUTE',
	'SEARCH', 'SEND', 'YAHOO'
];
var AUTOCAPITALIZATION_TYPES = [
	'ALL', 'NONE', 'SENTENCES', 'WORDS'
];

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
			isAttributedString = false,
			isAttributedHintText = false,
			hasUiNodes = false,
			controllerSymbol,
			parentSymbol;

		if (child.nodeName === 'AttributedHintText') {
			child.nodeName = 'AttributedString';
			isAttributedHintText = true;
		}

		// validate the child element and determine if it's part of
		// the textfield or a proxy property assigment
		if (!CU.isNodeForCurrentPlatform(child)) {
			return;
		} else if (_.includes(CONST.CONTROLLER_NODES, fullname)) {
			isControllerNode = true;
		} else if (fullname.split('.')[0] === '_ProxyProperty') {
			isProxyProperty = true;
		} else if (CU.validateNodeName(child, 'Ti.UI.AttributedString')) {
			if (!isAttributedHintText) {
				isAttributedString = true;
			}
		}

		// generate the node
		code += CU.generateNodeExtended(child, state, {
			parent: {},
			post: function(node, state, args) {
				controllerSymbol = state.controller;
				parentSymbol = state.parent ? state.parent.symbol : state.item.symbol;
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

		// generate code for the attribtuedString
		} else if (isAttributedString) {
			proxyProperties.attributedString = parentSymbol;
			node.removeChild(child);

		// generate code for the attribtuedHintText
		} else if (isAttributedHintText) {
			proxyProperties.attributedHintText = parentSymbol;
			node.removeChild(child);

		// generate code for the child components
		} else if (hasUiNodes || !isControllerNode) {
			postCode += '<%= parentSymbol %>.add(' + parentSymbol + ');';
		}

	});

	// support shortcuts for keyboard type, return key type, and autocapitalization
	var keyboardType = node.getAttribute('keyboardType');
	if (_.includes(KEYBOARD_TYPES, keyboardType.toUpperCase())) {
		node.setAttribute('keyboardType', 'Ti.UI.KEYBOARD_' + keyboardType.toUpperCase());
	}
	var returnKey = node.getAttribute('returnKeyType');
	if (_.includes(RETURN_KEY_TYPES, returnKey.toUpperCase())) {
		node.setAttribute('returnKeyType', 'Ti.UI.RETURNKEY_' + returnKey.toUpperCase());
	}
	var autocapitalization = node.getAttribute('keyboardType');
	if (_.includes(AUTOCAPITALIZATION_TYPES, autocapitalization.toUpperCase())) {
		node.setAttribute('autocapitalization', 'Ti.UI.TEXT_AUTOCAPITALIZATION_' + autocapitalization.toUpperCase());
	}


	// add all creation time properties to the state
	if (node.hasAttribute('clearOnEdit')) {
		var attr = node.getAttribute('clearOnEdit');
		extras.push(['clearOnEdit', attr === 'true']);
	}
	_.each(proxyProperties, function(v, k) {
		extras.push([k, v]);
	});
	if (extras.length) { state.extraStyle = styler.createVariableStyle(extras); }

	const nodeText = U.XML.getNodeText(node);
	if (nodeText && nodeText.trim() !== '') {
		state.extraStyle = state.extraStyle || {};
		if (U.isLocaleAlias(nodeText)) {
			state.extraStyle['value'] = styler.STYLE_EXPR_PREFIX + nodeText;
		} else {
			_.extend(state.extraStyle, styler.createVariableStyle('value', U.possibleMultilineString(U.trim(nodeText.replace(/'/g, "\\'")))));
		}
	}

	// generate the code for the textfield itself
	var nodeState = require('./default').parse(node, state);
	code += nodeState.code;

	// add the rows to the section
	if (nodeState.parent && postCode) {
		code += _.template(postCode)({
			parentSymbol: nodeState.parent.symbol
		});
	}

	// Update the parsing state
	return _.extend(state, {
		parent: nodeState.parent,
		code: code
	});
}
