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
		subParents = [],
		symbols = [],
		code = '';

	// iterate through all children
	for (var i = 0, l = children.length; i < l; i++) {
		var child = children[i],
			childArgs = CU.getParserArgs(child);

		// process each Tab and save its state
		var viewState;
		try {
			viewState = require('./' + childArgs.fullname).parse(child, CU.createEmptyState(state.styles));
		} catch(e) {
			viewState = require('./default').parse(child, CU.createEmptyState(state.styles));
		}
		subParents.push(viewState.parent);

		// TODO: quick fix to handle required views. Need to make this work for all 
		//       tag handlers.
		symbols.push(viewState.parent.symbol);
		code += viewState.code;
	}

	var extraStyle = CU.createVariableStyle('views', '[' + symbols.join(',') + ']');
	var scrollState = require('./default').parse(node, state, extraStyle);
	code += scrollState.code;

	// Update the parsing state
	return {
		parent: subParents,
		styles: state.styles,
		code: code
	}
};