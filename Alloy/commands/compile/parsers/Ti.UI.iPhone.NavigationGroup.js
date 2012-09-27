var _ = require('../../../lib/alloy/underscore')._,
	U = require('../../../utils'),
	CU = require('../compilerUtils');

var VALID_ELEMENT = 'Ti.UI.Window';

exports.parse = function(node, state) {
	return require('./base').parse(node, state, parse);
};

function parse(node, state, args) {
	var children = U.XML.getElementsFromNodes(node.childNodes),
		err = [
			'NavigationGroup must have only one child element.',
			'Valid elements:',
			'    <Window>',
			'    <Require>, which must contain only one top-level element and that element must be a <Window>'
		];
		code = '';

	// NavigationGroup must have 1 window as a child
	if (children.length !== 1) {
		U.die(err);
	} 

	// create code for the contained Window
	var child = children[0],
		childArgs = CU.getParserArgs(child),
		parserType;

	switch(childArgs.fullname) {
		case 'Alloy.Require':
			var inspect = CU.inspectRequireNode(child);
			if (inspect.length !== 1) {
				err.unshift('NavigationGroup <Require> child element contains ' + inspect.length + ' top-level elements.');
				U.die(err);
			} else if (inspect.names[0] !== 'Ti.UI.Window') {
				err.unshift('NavigationGroup <Require> child element does not contain a <Window>');
				U.die(err);
			} 
			parserType = 'Alloy.Require';
			break;
		case 'Ti.UI.Window':
			parserType = 'default';
			break;
		default:
			err.unshift('Invalid NavigationGroup child "' + childArgs.fullname + '"');
			U.die(err);
			break;
	}

	// create the code for the window
	code += CU.generateNode(child, CU.createEmptyState(state.styles));
	var winState = require('./' + parserType).parse(child, CU.createEmptyState(state.styles));

	// create navgroup with window 
	state.extraStyle = CU.createVariableStyle('window', winState.parent.symbol);
	var navState = require('./default').parse(node, state);
	code += navState.code;

	// Update the parsing state
	return {
		parent: winState.parent,
		styles: state.styles,
		code: code
	} 
}