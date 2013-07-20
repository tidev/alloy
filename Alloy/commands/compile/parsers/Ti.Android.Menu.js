var _ = require('../../../lib/alloy/underscore')._,
	U = require('../../../utils'),
	CU = require('../compilerUtils'),
	CONST = require('../../../common/constants'),
	logger = require('../../../logger');

exports.parse = function(node, state) {
	return require('./base').parse(node, state, parse);
};

function parse(node, state, args) {
	var eventObject = 'e',
		code = '';

	// if this isn't android, generate no code, but show a warning
	var config = CU.getCompilerConfig(),
		platform = config && config.alloyConfig ? config.alloyConfig.platform : undefined;
	if (platform !== 'android') {
		if (node.getAttribute('platform') !== 'android') {
			logger.warn([
				'<Menu> is only available in Android',
				'To get rid of this warning, add platform="android" to your <Menu> element'
			]);
		}
		return {
			parent: {},
			styles: state.styles,
			code: ''
		};
	}

	// Start the onCreateOptionsMenu() call
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
			androidMenu: true,
			parent: {
				node: node,
				symbol: eventObject + '.menu'
			}
		});
	});

	// Update the parsing state
	return {
		parent: {},
		styles: state.styles,
		code: U.evaluateTemplate('Ti.Android.Menu.js', {
			parent: state.parent.symbol || CONST.PARENT_SYMBOL_VAR,
			code: code,
			eventObject: eventObject,
			openFunc: CU.generateUniqueId()
		})
	};
}