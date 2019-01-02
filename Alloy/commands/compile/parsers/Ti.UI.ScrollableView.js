var _ = require('lodash'),
	styler = require('../styler'),
	U = require('../../../utils'),
	CU = require('../compilerUtils'),
	CONST = require('../../../common/constants');

exports.parse = function(node, state) {
	return require('./base').parse(node, state, parse);
};

function parse(node, state, args) {
	var children = U.XML.getElementsFromNodes(node.childNodes),
		arrayName = CU.generateUniqueId(),
		isCollectionBound = args[CONST.BIND_COLLECTION] ? true : false,
		code = 'var ' + arrayName + '=[];\n';

	if (!isCollectionBound) {
		// iterate through all children
		for (var i = 0, l = children.length; i < l; i++) {
			var child = children[i];

			// generate the code for the subview
			code += CU.generateNodeExtended(child, state, {
				parent: {},
				post: function(node, state, args) {
					return (state && state.parent && state.parent.symbol) ? arrayName + '.push(' + state.parent.symbol + ');\n' : '';
				}
			});
		}
	}

	// create the ScrollableView itself
	if (isCollectionBound) {
		_.each(CONST.BIND_PROPERTIES, function(p) {
			node.removeAttribute(p);
		});
	}
	state.extraStyle = styler.createVariableStyle('views', arrayName);
	var scrollState = require('./default').parse(node, state);
	code += scrollState.code;

	if (isCollectionBound) {
		var localModel = CU.generateUniqueId();
		var itemCode = '';

		_.each(U.XML.getElementsFromNodes(node.childNodes), function(child) {
			itemCode += CU.generateNodeExtended(child, state, {
				parent: {},
				local: true,
				model: localModel,
				post: function(node, state, args) {
					return 'views.push(' + state.parent.symbol + ');\n';
				}
			});
		});

		if (state.parentFormFactor || node.hasAttribute('formFactor')) {
			// if this node or a parent has set the formFactor attribute
			// we need to pass it to the data binding generator
			args.parentFormFactor = (state.parentFormFactor || node.getAttribute('formFactor'));
		}
		code += _.template(CU.generateCollectionBindingTemplate(args))({
			localModel: localModel,
			pre: 'var views=[];',
			items: itemCode,
			post: scrollState.parent.symbol + '.views=views;'
		});
	}

	// Update the parsing state
	return {
		parent: {},
		styles: state.styles,
		code: code
	};
}
