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
		code = 'var ' + arrayName + ' = [];\n',
		itemCode = '',
		isCollectionBound = args[CONST.BIND_COLLECTION] ? true : false,
		localModel, controllerSymbol;

	if (isCollectionBound) {
		_.each(CONST.BIND_PROPERTIES, function(p) {
			node.removeAttribute(p);
		});
	}

	// iterate through all children
	for (var i = 0, l = children.length; i < l; i++) {
		var child = children[i],
			childArgs = CU.getParserArgs(child);

		// Process the Map's Annotations
		if (childArgs.fullname === 'Ti.Map.Annotation' ||
			childArgs.fullname === 'Alloy.Require') {
			// ensure <Require> is actually a single <Annotation>
			if (childArgs.fullname === 'Alloy.Require') {
				var inspect = CU.inspectRequireNode(child);
				if (inspect.length !== 1 || inspect.names[0] !== 'Ti.Map.Annotation') {
					// The <Require> is not an Annotation, process later
					continue;
				}
			}
			// generate code for the Annotation
			code += CU.generateNodeExtended(child, state, {
				parent: {},
				post: function(node, state, args) {
					return arrayName + '.push(' + state.parent.symbol + ');\n';
				}
			});

			// When we are done processing the Annotation, remove it from the
			// markup. That way we can just pass back the current Map state as
			// the returned state and it can continue to process any other children
			// without special handling
			node.removeChild(child);
		}
	}

	// Create the initial Map code
	state.extraStyle = styler.createVariableStyle('annotations', arrayName);
	var mapState = require('./default').parse(node, state);
	code += mapState.code;

	if (isCollectionBound) {
		_.each(CONST.BIND_PROPERTIES, function(p) {
			node.removeAttribute(p);
		});
		localModel = localModel || CU.generateUniqueId();

		if (state.parentFormFactor || node.hasAttribute('formFactor')) {
			// if this node or a parent has set the formFactor attribute
			// we need to pass it to the data binding generator
			args.parentFormFactor = (state.parentFormFactor || node.getAttribute('formFactor'));
		}
		// set a custom property for special handling of Annotations in CU.generateCollectionBindingTemplate()
		args.isDataBoundMap = true;
		code += _.template(CU.generateCollectionBindingTemplate(args))({
			localModel: localModel,
			pre: '',
			items: itemCode,
			annotationArray: arrayName,
			post: args.symbol + '.annotations=' + arrayName + ';'
		});
	}

	// Update the parsing state
	return _.extend(mapState, {code:code});
}
