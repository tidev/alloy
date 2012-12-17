var _ = require('../../../lib/alloy/underscore')._,
	U = require('../../../utils'),
	CU = require('../compilerUtils'),
	logger = require('../../../common/logger');

exports.parse = function(node, state) {
	return require('./base').parse(node, state, parse);
};

function parse(node, state, args) {
	var children = U.XML.getElementsFromNodes(node.childNodes),
		arrayName = CU.generateUniqueId(),
		activitySymbol = state.parent.symbol + '.activity',
		eventObject = 'e';

	// if this isn't android, generate no code, but show a warning
	var config = CU.getCompilerConfig();
	var platform = config && config.alloyConfig ? config.alloyConfig.platform : undefined;
	if (platform !== 'android' && node.getAttribute('platform') !== 'android') {
		logger.warn([
			'<Menu> is only available in Android',
			'To get rid of this warning, add platform="android" to your <Menu> element'
		]);
		return {
			parent: {},
			styles: state.styles,
			code: ''
		};
	}

	// assert that the parent is a Ti.UI.Window
	var parentNode = CU.validateNodeName(state.parent.node, 'Ti.UI.Window');
	if (!parentNode) {
		U.die([
			'Invalid parent type for <Menu>: ' + state.parent.node.nodeName,
			'<Menu> must have a Ti.UI.Window as a parent'
		]);
	}

	// Start the onCreateOptionsMenu() call
	var code = activitySymbol + '.onCreateOptionsMenu = function(' + eventObject + ') {';

	_.each(U.XML.getElementsFromNodes(node.childNodes), function(child) {
		var childArgs = CU.getParserArgs(child, state);
		var theNode = CU.validateNodeName(child, 'Ti.Android.MenuItem');
		
		// Make sure we are dealing with MenuItems
		if (!theNode) {
			U.die([
				'Invalid child type under <Menu>: ' + childArgs.fullname,
				'<Menu> must have only <MenuItem> elements as children'
			]);
		}

		// generate code for the MenuItem
		code += CU.generateNodeExtended(child, state, {
			parent: { 
				node: node,
				symbol: eventObject + '.menu'
			}
		});
	});

	// close the onCreateOptionsMenu() call
	code += '};';

	// Update the parsing state
	return {
		parent: {},
		styles: state.styles,
		code: code
	}
};