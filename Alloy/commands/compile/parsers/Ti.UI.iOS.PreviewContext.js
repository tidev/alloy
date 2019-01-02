var _ = require('lodash'),
	styler = require('../styler'),
	CU = require('../compilerUtils'),
	U = require('../../../utils');

exports.parse = function(node, state) {
	return require('./base').parse(node, state, parse);
};

function parse(node, state, args) {
	var code = '',
		parentViewId,
		preview,
		actions,
		previewContextState,
		extraStyle = [];

	_.each(U.XML.getElementsFromNodes(node.childNodes), function(child) {

		if (child.nodeName === 'Actions') {
			state.itemsArray = CU.generateUniqueId();
			actions = state.itemsArray;
		}

		code += CU.generateNodeExtended(child, state, {
			parent: {},
			post: function(node, state, args) {
				if (child.nodeName === 'Preview') {
					preview = state.parent.proxyProperty;
				}
			}
		});

	});

	if (args.parent.symbol) {
		parentViewId = args.parent.symbol;
		delete args.parent.symbol;
	}

	preview && extraStyle.push(['preview', preview]);
	actions && extraStyle.push(['actions', actions]);
	if (extraStyle.length) {
		state.extraStyle = styler.createVariableStyle(extraStyle);
	}

	previewContextState = require('./default').parse(node, state);
	code += previewContextState.code;

	if (parentViewId) {
		code += parentViewId + '.previewContext = ' + previewContextState.parent.symbol + ';';
	} else {
		node.parentNode.previewContext = previewContextState.parent.symbol;
	}

	return {
		parent: {},
		styles: state.styles,
		code: code
	};
}
