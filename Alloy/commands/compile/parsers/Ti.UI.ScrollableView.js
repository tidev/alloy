// TODO: pass errors back to the calling function in the compile
//       command to give more visibility into the error, things like view
//       name, view file, etc...

var _ = require('../../../lib/alloy/underscore')._,
	U = require('../../../utils'),
	CU = require('../compilerUtils');

exports.parse = function(node, state) {
	return require('./base').parse(node, state, parse);
}

function parse(node, state, args) {
	var children = U.XML.getElementsFromNodes(node.childNodes),
		arrayName = CU.generateUniqueId(),
		code = 'var ' + arrayName + ' = [];\n';

	// iterate through all children
	for (var i = 0, l = children.length; i < l; i++) {
		var child = children[i];

		// generate the code for the subview
		code += CU.generateNode(child, {
			parent: {},
			styles: state.styles,
			post: function(node, state, args) {
				return arrayName + '.push(' + state.parent.symbol + ');\n';
			}
		});
	}

	// create the ScrollableView itself
	state.extraStyle = CU.createVariableStyle('views', arrayName);
	code += require('./default').parse(node, state).code;

	// Update the parsing state
	return {
		parent: {},
		styles: state.styles,
		code: code
	}
};