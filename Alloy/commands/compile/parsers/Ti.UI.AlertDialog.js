var _ = require('../../../lib/alloy/underscore')._,
	U = require('../../../utils'),
	CU = require('../compilerUtils'),
	logger = require('../../../common/logger');

var VALID = [
	'Alloy.Abstract.ButtonNames'
];

exports.parse = function(node, state) {
	return require('./base').parse(node, state, parse);
};

function parse(node, state, args) {
	var config = CU.getCompilerConfig(),
		isAndroid = config && config.alloyConfig && config.alloyConfig.platform === 'android',
		androidView = null,
		extras = [],
		code = '';

	_.each(U.XML.getElementsFromNodes(node.childNodes), function(child) {
		switch(CU.validateNodeName(child, VALID)) {
			case 'Alloy.Abstract.ButtonNames': 
				var bnState = {
					parent: {},
					styles: state.styles,
					buttonNameArray: CU.generateUniqueId()
				};

				code += CU.generateNode(child, bnState);
				extras.push(['buttonNames', bnState.buttonNameArray]);
				break;
			default:
				// process potential androidView
				if (androidView === null) {
					if (isAndroid) {
						androidView = CU.generateNode(child, {
							parent: {},
							styles: state.styles,
							post: function(node, state, args) {
								extras.push(['androidView', state.parent.symbol]);
							}
						});
						code += androidView;
					} else {
						logger.warn('Additional views in AlertDialog only supported on Android');
					}
				} else {
					U.die('AlertDialog can only have one androidView');
				}	
				break;
		}
	});

	// Add options and button names to the style, if present
	if (extras.length) {	
		state.extraStyle = CU.createVariableStyle(extras);
	}
	state.parent = {};

	var alertState = require('./default').parse(node, state);
	code += alertState.code;

	// Update the parsing state
	return {
		parent: {},
		styles: state.styles,
		code: code
	};
};