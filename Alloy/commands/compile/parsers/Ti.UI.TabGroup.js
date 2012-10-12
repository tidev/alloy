var _ = require('../../../lib/alloy/underscore')._,
	U = require('../../../utils'),
	CU = require('../compilerUtils');

exports.parse = function(node, state) {
	return require('./base').parse(node, state, parse);
};

function parse(node, state, args) {
	var code = '';

	// Create the initial TabGroup code
	var groupState = require('./default').parse(node, state);
	code += groupState.code;

	_.each(U.XML.getElementsFromNodes(node.childNodes), function(child) {
		var theNode = CU.validateNodeName(child, 'Ti.UI.Tab');
		if (theNode) {
			code += CU.generateNode(child, {
				parent: {},
				styles: state.styles,
				post: function(node, state, args) {
					console.log(state);
					console.log(args);
					return groupState.parent.symbol + '.addTab(' + state.parent.symbol + ');';
				}
			});
		} else {
			U.die([
				'Invalid <TabGroup> child type: ' + CU.getNodeFullname(child),
				'All <TabGroup> children must be <Tab>'
			]);
		}
	});




	// // iterate through all children
	// for (var i = 0, l = children.length; i < l; i++) {
	// 	var child = children[i],
	// 		childArgs = CU.getParserArgs(child),
	// 		err = errBase + ' Invalid child at position ' + i,
	// 		isRequire;

	// 	// Make sure all children are Tabs
	// 	switch(childArgs.fullname) {
	// 		case 'Ti.UI.Tab':
	// 			isRequire = false;
	// 			break;
	// 		case 'Alloy.Require': 
	// 			var inspect = CU.inspectRequireNode(child);
	// 			if (inspect.length !== 1 || inspect.names[0] !== 'Ti.UI.Tab') {
	// 				U.die(err);
	// 			}
	// 			isRequire = true;
	// 			break;
	// 		default:
	// 			U.die(err);
	// 			break;
	// 	}

	// 	// Generate each Tab, and the views contained within it
	// 	code += CU.generateNode(child, {
	// 		parent: {},
	// 		styles: state.styles,
	// 		post: function(n,s,a) {
	// 			return args.symbol + '.addTab(' + (isRequire ? s.parent.symbol : a.symbol) + ');\n';
	// 		}
	// 	});
	// }

	// Update the parsing state
	return {
		parent: {},
		styles: state.styles,
		code: code
	}
};