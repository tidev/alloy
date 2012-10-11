var _ = require('../../../lib/alloy/underscore')._,
	U = require('../../../utils'),
	CU = require('../compilerUtils'),
	logger = require('../../../common/logger');

var VALID = [
	'Alloy.Abstract.BarItemTypes',
	'Alloy.Abstract.Labels'
];

exports.parse = function(node, state) {
	return require('./base').parse(node, state, parse);
};

function parse(node, state, args) {
	var extras = [],
		code = '';

	_.each(U.XML.getElementsFromNodes(node.childNodes), function(child, index) {
		switch(CU.validateNodeName(child, VALID)) {
			case 'Alloy.Abstract.Labels':
				child.nodeName = 'BarItemTypes';
				child.setAttribute('ns', 'Alloy.Abstract');
			case 'Alloy.Abstract.BarItemTypes': 
				var bitState = {
					parent: {},
					styles: state.styles,
					barItemTypesArray: CU.generateUniqueId()
				};

				code += CU.generateNode(child, bitState);
				extras.push(['labels', bitState.barItemTypesArray]);

				// get rid of the node when we're done so we can pass the current state
				// back to generateNode() and then process any additional views that 
				// need to be added to the view hierarchy
				node.removeChild(child);
				break;
			default:
				// do nothing, additional views will be processed on the next pass
				break;
		}
	});

	if (extras.length) {	
		state.extraStyle = CU.createVariableStyle(extras);
	}
	var buttonBarState = require('./default').parse(node, state);
	code += buttonBarState.code;

	// Update the parsing state
	return _.extend(buttonBarState, {code:code}); 
};