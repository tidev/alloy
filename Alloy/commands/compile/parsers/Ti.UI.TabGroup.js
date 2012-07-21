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

	// Create the initial TabGroup code
	code += require('./default').parse(node, state).code;

	// Gotta have at least one Tab
	if (children.length === 0) {
		U.die('TabGroup must have at least one Tab as a child');
	}

	// iterate through all children
	for (var i = 0, l = children.length; i < l; i++) {
		var child = children[i];

		// Make sure all children are Tabs
		if (CU.getParserArgs(child).fullname !== 'Ti.UI.Tab') {
			U.die('All TabGroup children must be of type Ti.UI.Tab. Invalid child at position ' + i);
		}

		// Generate each Tab, and the views contained within it
		code += CU.generateNode(child, {
			parent: { 
				node: node,
				symbol: args.symbol 
			},
			styles: state.styles,
			post: function(n,s,a) {
				return args.symbol + '.addTab(' + a.symbol + ');\n';
			}
		});
	}

	// Update the parsing state
	return {
		parent: {},
		styles: state.styles,
		code: code
	}
};