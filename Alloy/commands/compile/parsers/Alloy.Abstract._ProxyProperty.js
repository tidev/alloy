var _ = require('../../../lib/alloy/underscore')._,
	U = require('../../../utils'),
	CU = require('../compilerUtils');

function fixDefinition(def) {
	def || (def = {});
	def.parents || (def.parents = []);
	def.children || (def.children = []);
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
	if (def.parents.length > 0) {
		if (!CU.validateNodeName(state.parent.node, def.parents)) {
			U.dieWithNode(node, 'Parent element must one of the following: [' + def.parents.join(',') + ']');
		}
	}

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
	code += state.parent.symbol + '.' + U.lcfirst(node.nodeName) + '=' + proxy + ';';

	return {
		parent: {},
		code: code
	}
}