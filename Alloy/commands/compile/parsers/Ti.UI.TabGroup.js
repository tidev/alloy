var _ = require('../../../lib/alloy/underscore')._,
	U = require('../../../utils'),
	CU = require('../compilerUtils');

exports.parse = function(node, state) {
	return require('./base').parse(node, state, parse);
};

function parse(node, state, args) {
	var children = U.XML.getElementsFromNodes(node.childNodes),
		errBase = 'All <TabGroup> children must be a <Tab>, or a <Require> that contains a single tab. '
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
			err = errBase + ' Invalid child at position ' + i,
			isRequire;

		// Make sure all children are Tabs
		switch(childArgs.fullname) {
			case 'Ti.UI.Tab':
				isRequire = false;
				break;
			case 'Alloy.Require': 
				var inspect = CU.inspectRequireNode(child);
				if (inspect.length !== 1 || inspect.names[0] !== 'Ti.UI.Tab') {
					U.die(err);
				}
				isRequire = true;
				break;
			default:
				U.die(err);
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