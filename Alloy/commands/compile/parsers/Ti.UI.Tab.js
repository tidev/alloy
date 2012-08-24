// TODO: pass errors back to the calling function in the compile
//       command to give more visibility into the error, things like view
//       name, view file, etc...

var _ = require('../../../lib/alloy/underscore')._,
	U = require('../../../utils'),
	CU = require('../compilerUtils');

exports.parse = function(node, state) {
	return require('./base').parse(node, state, parse);
};

function parse(node, state, args) {
	var children = U.XML.getElementsFromNodes(node.childNodes),
		code = '';

	// Generate code for Tab's Window
	var winSymbol;
	code += CU.generateNode(children[0], {
		parent: {},
		styles: state.styles,
		post: function(n,s,a) {
			winSymbol = s.parent.symbol;
		}
	});

	// Generate the code for the Tab itself, with the Window in it
	code += require('./default').parse(node, {
		parent: {},
		styles: state.styles,
		extraStyle: CU.createVariableStyle('window', winSymbol)
	}).code;

	// Update the parsing state
	return {
		parent: {}, 
		styles: state.styles,
		code: code
	}
};