var _ = require('../../../lib/alloy/underscore')._,
	U = require('../../../utils'),
	CU = require('../compilerUtils');

exports.parse = function(node, state) {
	return require('./base').parse(node, state, parse);
};

function parse(node, state, args) {
	var children = U.XML.getElementsFromNodes(node.childNodes),
		code = '';

	// NavigationGroup must have 1 window as a child
	if (children.length !== 1) {
		U.die('Ti.UI.iPhone.NavigationGroup should have one Window as a child element.');
	} 

	// create code for the contained Window
	var child = children[0],
		childArgs = CU.getParserArgs(child),
		parserType;

	switch(childArgs.fullname) {
		case 'Alloy.Require':
			// TODO: need additional checks to ensure that what is contained in
			//       <Require> is actually a Window.
			parserType = 'Alloy.Require';
			break;
		case 'Ti.UI.Window':
			parserType = 'default';
			break;
		default:
			U.die('NavigationGroup child is not a Window');
			break;
	}

	// create the code for the window
	var winState = require('./' + parserType).parse(child, CU.createEmptyState(state.styles));
	code += winState.code;

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