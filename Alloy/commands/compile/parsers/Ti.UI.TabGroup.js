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
		var child = children[i],
			childArgs = CU.getParserArgs(child),
			isRequire;

		// Make sure all children are Tabs
		switch(childArgs.fullname) {
			case 'Ti.UI.Tab':
				isRequire = false;
				break;
			case 'Alloy.Require': 
				// TODO: confirm <Require> is actually a Tab
				isRequire = true;
				break;
			default:
				U.die('All TabGroup children must be of type Ti.UI.Tab. Invalid child at position ' + i);
				break;
		}

		// Generate each Tab, and the views contained within it
		code += CU.generateNode(child, {
			parent: {},
			styles: state.styles,
			post: function(n,s,a) {
				return args.symbol + '.addTab(' + (isRequire ? s.parent.symbol : a.symbol) + ');\n';
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