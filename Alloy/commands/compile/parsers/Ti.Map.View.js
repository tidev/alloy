// TODO: pass errors back to the calling function in the compile
//       command to give more visibility into the error, things like view
//       name, view file, etc...

var _ = require('../../../lib/alloy/underscore')._,
	U = require('../../../utils'),
	CU = require('../compilerUtils');

exports.parse = function(node, state) {
	var args = CU.getParserArgs(node, state),
		children = U.XML.getElementsFromNodes(node.childNodes),
		linePrefix = '\t',
		annotationSymbols = [],
		arrayName = CU.generateUniqueId(),
		code = 'var ' + arrayName + ' = [];\n';

	// iterate through all children
	for (var i = 0, l = children.length; i < l; i++) {
		var child = children[i],
			childArgs = CU.getParserArgs(child);

		// Process the Map's Annotations
		if (childArgs.fullname === 'Ti.Map.Annotation') {
			var annCode = CU.generateNode(child, {
				parent: {},
				styles: state.styles,
				arrayName: arrayName 
			});
			code += annCode;

			// When we are done processing the Annotation, remove it from the
			// markup. That way we can just pass back the current Map state as 
			// the returned state and it can continue to process any other children
			// without special handling
			node.removeChild(child);
		} 
	}

	// Create the initial Map code
	var extraStyle = CU.createVariableStyle('annotations', arrayName);
	var mapState = require('./default').parse(node, state, extraStyle);
	code += mapState.code;

	// Update the parsing state
	return _.extend(mapState, {code:code}); 
};