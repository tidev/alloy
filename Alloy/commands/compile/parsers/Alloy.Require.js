var path = require('path'),
	_ = require('../../../lib/alloy/underscore')._,
	CU = require('../compilerUtils'),
	U = require('../../../utils'),
	CONST = require('../../../common/constants'),
	TYPES = ['view','widget'];

exports.parse = function(node, state) {
	return require('./base').parse(node, state, parse);
};

function parse(node, state, args) {
	var code = '',
		type = node.getAttribute('type') || CONST.REQUIRE_TYPE_DEFAULT,
		src = node.getAttribute('src'),
		method;

	// validate src
	if (!src) {
		U.die('<Require> elements must have a "src" attribute.');
	} else if (U.XML.getElementsFromNodes(node.childNodes).length !== 0) {
		U.die('<Require> elements may not have child elements.');
	}

	// determine which Alloy method to use
	var extraArgs = '';
	switch(type) {
		case 'view':
			method = 'createController';
			break;
		case 'widget':
			method = 'createWidget';
			extraArgs = "'widget',";
			break;
		default:
			U.die('Invalid <Require> type "' + type + '"');
	}

	// TODO: compile time confirm src exists - https://jira.appcelerator.org/browse/ALOY-212

	// Remove <Require>-specific attributes from createArgs
	delete args.createArgs.type;
	delete args.createArgs.src;

	// Generate runtime code
	code += args.symbol + " = Alloy." + method + "('" + src + "'," + extraArgs + CU.generateStyleParams(
		state.styles, 
		args.classes, 
		args.id, 
		node.nodeName, 
		args.createArgs
	) + ");\n";
	if (args.parent.symbol) {
		code += args.symbol + '.setParent(' + args.parent.symbol + ');\n';
	} 

	return {
		parent: {
			node: node,
			symbol: args.symbol + '.getViewEx({recurse:true})'
		},
		styles: state.styles,
		code: code
	}
};