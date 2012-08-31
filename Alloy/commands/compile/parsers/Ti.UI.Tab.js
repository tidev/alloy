var _ = require('../../../lib/alloy/underscore')._,
	U = require('../../../utils'),
	CU = require('../compilerUtils');

exports.parse = function(node, state) {
	return require('./base').parse(node, state, parse);
};

function parse(node, state, args) {
	var children = U.XML.getElementsFromNodes(node.childNodes),
		err = [
			'Tab must have only one child element.',
			'Valid elements:',
			'    <Window>',
			'    <Require>, which must contain only one top-level element and that element must be a <Window>'
		],
		code = '';

	if (children.length !== 1) {
		U.die(err);
	}

	// Generate code for Tab's Window
	// TODO: assert children[0] is actually a Window - https://jira.appcelerator.org/browse/ALOY-217
	var child = children[0],
		childArgs = CU.getParserArgs(child),
		winSymbol;

	switch(childArgs.fullname) {
		case 'Alloy.Require':
			var inspect = CU.inspectRequireNode(child);
			if (inspect.length !== 1) {
				err.unshift('Tab <Require> child element contains ' + inspect.length + ' top-level elements.');
				U.die(err);
			} else if (inspect.names[0] !== 'Ti.UI.Window') {
				err.unshift('Invalid Tab <Require> child "' + inspect.names[0] + '"');
				U.die(err);
			} 
			break;
		case 'Ti.UI.Window':
			break;
		default:
			err.unshift('Invalid Tab child "' + childArgs.fullname + '"');
			U.die(err);
			break;
	}

	code += CU.generateNode(child, {
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