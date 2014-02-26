var _ = require('../../../lib/alloy/underscore')._,
	U = require('../../../utils'),
	CU = require('../compilerUtils'),
	CONST = require('../../../common/constants'),
	logger = require('../../../logger'),
	util = require('util');

function fixDefinition(def) {
	def = def || {};
	def = _.defaults(def, {
		parents: [],
		children: []
	});
	return def;
}

exports.parse = function(node, state) {
	return require('./base').parse(node, state, parse);
};

function parse(node, state, args) {
	var def = fixDefinition(state.proxyPropertyDefinition),
		code = '',
		proxy;

	// validate parent
	if (def.parents.length > 0 && state.parent && state.parent.node) {
		if (!CU.validateNodeName(state.parent.node, def.parents)) {
			U.dieWithNode(node, 'Parent element must one of the following: [' + def.parents.join(',') + ']');
		}
	}

	if(!node.hasChildNodes()) {
		// Per ALOY-714, support shorthand notation for LeftNavButton, RightNavButton
		var origNodeName = node.nodeName,
			eventRegEx = /^on([A-Z].+)/;
		node.nodeName = 'Button';
		// need to remove the 'on*' properties from the node to prevent event listeners from being added twice
		_.each(node.attributes, function(attr) {
			if(eventRegEx.test(attr.name)) {
				node.removeAttribute(attr.name);
			}
		});
		code += CU.generateNodeExtended(node, state, {
			parent: {},
			post: function(node, state, args) {
				proxy = state.parent.symbol;
			}
		});
		// assign proxy property to parent based on its original node name
		code += (state.parent && state.parent.symbol ? state.parent.symbol : CONST.PARENT_SYMBOL_VAR) +
				'.' + U.lcfirst(origNodeName) + '=' + proxy + ';';
	} else {
		// process children
		_.each(U.XML.getElementsFromNodes(node.childNodes), function(child) {
			var childArgs = CU.getParserArgs(child, state);

			// validate children
			if (def.children.length > 0) {
				if (!CU.validateNodeName(child, def.children)) {
					U.dieWithNode(node, 'Child element must one of the following: [' + def.children.join(',') + ']');
				}
			}

			// generate proxy property
			code += CU.generateNodeExtended(child, state, {
				parent: {},
				post: function(node, state, args) {
					proxy = state.parent.symbol;
				}
			});
		});
		// assign proxy property to parent
		code += (state.parent && state.parent.symbol ? state.parent.symbol : CONST.PARENT_SYMBOL_VAR) +
			'.' + U.lcfirst(node.nodeName) + '=' + proxy + ';';
	}




	return {
		parent: {},
		code: code
	};
}