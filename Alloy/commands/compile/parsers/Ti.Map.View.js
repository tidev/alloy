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
		code = '';

	// iterate through all children
	for (var i = 0, l = children.length; i < l; i++) {
		var child = children[i],
			childArgs = CU.getParserArgs(child);

		// Process the Map's Annotations
		if (childArgs.fullname === 'Ti.Map.Annotation') {
			var annotationState = require('./default').parse(child, CU.createEmptyState(state.styles));
			annotationSymbols.push(annotationState.parent.symbol);
			code += annotationState.code;

			// When we are done processing the Annotation, remove it from the
			// markup. That way we can just pass back the current Map state as 
			// the returned state and it can continue to process any other children
			// without special handling
			node.removeChild(child);
		} 
	}

	// Create the initial Map code
	var mapState;
	if (annotationSymbols.length > 0) {
		var extraStyle = { annotations: { value:'[' + annotationSymbols.join(',') + ']' } };
		extraStyle.annotations[CU.STYLE_ALLOY_TYPE] = 'var';
		mapState = require('./default').parse(node, state, extraStyle);
	} else {
		mapState = require('./default').parse(node, state);
	}
	code += mapState.code;

	// Update the parsing state
	return _.extend(mapState, {code:code}); 
};