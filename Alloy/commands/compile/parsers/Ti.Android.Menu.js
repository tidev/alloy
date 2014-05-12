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

	// ALOY-784, support Activity properties as attributes of <Menu>
	var menuTssStyles = _.filter(state.styles, function(elem) {
			// generates a sorted array of styles filtered to include only elements
			// associated with the menu (by ID, class, or API name)
			return elem.key === node.getAttribute('id') || elem.key === node.getAttribute('class') || elem.key === node.nodeName;
		});
	var xmlStyles = {
		title: node.getAttribute('title') ? node.getAttribute('title') : undefined,
		subtitle: node.getAttribute('subtitle') ? node.getAttribute('subtitle') : undefined,
		backgroundImage: node.getAttribute('backgroundImage') ? node.getAttribute('backgroundImage') : undefined,
		displayHomeAsUp: node.getAttribute('displayHomeAsUp') ? node.getAttribute('displayHomeAsUp') : undefined,
		icon: node.getAttribute('icon') ? node.getAttribute('icon') : undefined,
		logo: node.getAttribute('logo') ? node.getAttribute('logo') : undefined,
		navigationMode: node.getAttribute('navigationMode') ? node.getAttribute('navigationMode') : undefined,
		onHomeIconItemSelected: node.getAttribute('onHomeIconItemSelected') ? node.getAttribute('onHomeIconItemSelected') : undefined
	};
	// to respect proper style hierarchy, take the last element in the array (which will be the highest priority)
	var menuTssKey = _.isArray(menuTssStyles) ? menuTssStyles.length-1 : 0;
	if(menuTssStyles[menuTssKey] && menuTssStyles[menuTssKey].style) {
		_.defaults(xmlStyles, menuTssStyles[menuTssKey].style);
	}
	if((_.filter(_.values(xmlStyles), function(val) { return val !== undefined; })).length > 0) {
		// TODO: once Android 2.x support is deprecated, remove the if(actionBar) test from the following
		// to speed up execution of the resulting code
		code += 'if(' + state.parent.symbol + '.activity.actionBar) {\n';
			if(xmlStyles.title)  { code += state.parent.symbol + '.activity.actionBar.title = "' + xmlStyles.title + '";'; }
			if(xmlStyles.subtitle)  { code += state.parent.symbol + '.activity.actionBar.subtitle = "' + xmlStyles.subtitle + '";'; }
			if(xmlStyles.backgroundImage)  { code += state.parent.symbol + '.activity.actionBar.backgroundImage = "' + xmlStyles.backgroundImage + '";'; }
			if(xmlStyles.displayHomeAsUp)  { code += state.parent.symbol + '.activity.actionBar.displayHomeAsUp = ' + xmlStyles.displayHomeAsUp + ';'; }
			if(xmlStyles.icon)  { code += state.parent.symbol + '.activity.actionBar.icon = "' + xmlStyles.icon + '";'; }
			if(xmlStyles.logo)  { code += state.parent.symbol + '.activity.actionBar.logo = "' + xmlStyles.logo + '";'; }
			if(xmlStyles.navigationMode)  { code += state.parent.symbol + '.activity.actionBar.navigationMode = ' + xmlStyles.navigationMode + ';'; }
			if(xmlStyles.onHomeIconItemSelected)  { code += state.parent.symbol + '.activity.actionBar.onHomeIconItemSelected = ' + xmlStyles.onHomeIconItemSelected + ';'; }
		code += '}\n';
	}
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
