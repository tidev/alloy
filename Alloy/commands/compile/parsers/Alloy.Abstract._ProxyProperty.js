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
		proxyPropertyName = U.lcfirst(node.nodeName),
		code = '',
		proxy;

	// validate parent
	if (def.parents.length > 0 && state.parent && state.parent.node) {
		if (!CU.validateNodeName(state.parent.node, def.parents)) {
			U.dieWithNode(node, 'Parent element must one of the following: [' + def.parents.join(',') + ']');
		}
	}

	// standard proxy property handling
	if(node.hasChildNodes()) {

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

	// explicitly create nav buttons from proxy property element
	} else if (_.contains(['LeftNavButton', 'RightNavButton'], node.nodeName)) {
		node.nodeName = 'Button';
		var exState = _.extend(_.clone(state), { parent: {} });
		var buttonState = require('./Ti.UI.Button').parse(node, exState);
		code += buttonState.code;
		proxy = buttonState.parent.symbol;

	// fail if there's no children and its not nav buttons
	} else {
		U.dieWithNode(node, '<' + node.nodeName + '> requires a child element');
	}

	// assign proxy property to parent
	code += (state.parent && state.parent.symbol ? state.parent.symbol : CONST.PARENT_SYMBOL_VAR) +
			'.' + proxyPropertyName + '=' + proxy + ';';

	return {
		parent: {},
		code: code
	};
}