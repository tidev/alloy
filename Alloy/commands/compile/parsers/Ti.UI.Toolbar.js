var _ = require('lodash'),
	tiapp = require('../../../tiapp'),
	U = require('../../../utils'),
	CONST = require('../../../common/constants'),
	CU = require('../compilerUtils');

exports.parse = function(node, state) {
	var platform = CU.getCompilerConfig().alloyConfig.platform;
	if (tiapp.version.lt(tiapp.getSdkVersion(), '6.2.0')) {
		if (platform !== 'ios') {
			U.die('Ti.UI.Toolbar requires Titanium 6.2.0+');
		}
		node.setAttribute('ns', 'Ti.UI.iOS');
	}

	var eventObject = 'e',
		code = '',
		xmlStyles = {};
	// Properties inherited from ActionBar when Toolbar is passed to the Activity
	var inheritedProperties = [CONST.BACKGROUND_IMAGE, CONST.DISPLAY_HOME_AS_UP, CONST.HOME_BUTTON_ENABLED, CONST.NAVIGATION_MODE, CONST.ON_HOME_ICON_ITEM_SELECTED];

	state = _.extend(state, {
		itemContainerDefinition: {
			children: [
				{ name: 'Alloy.Abstract.Items', property: 'items' }
			]
		}
	});

	var tempRes = require('./Alloy.Abstract._ItemContainer').parse(node, state);

	// Only if the Ti.UI.Toolbar is passed as an ActionBar to the activity
	if (state.parent && state.parent.node && state.parent.node.getAttribute('customToolbar') === node.getAttribute('id')) {

		var activityTssStyles = _.filter(state.styles, function(elem) {
			// Generates a sorted array of styles filtered to include only elements
			// associated with the activity (by ID, class, or API name)
			return elem.key === node.getAttribute('id') || elem.key === node.getAttribute('class') || elem.key === node.nodeName;
		});
		// Create an object holding all the actionBar-related properties set in the XML
		_.each(inheritedProperties, function(prop) {
			if (node.hasAttribute(prop)) {
				xmlStyles[prop] = node.getAttribute(prop);
			}
		});
		// To respect proper style hierarchy, take the last element in the array (which will be the highest priority)
		var activityTssKey = _.isArray(activityTssStyles) ? activityTssStyles.length - 1 : 0;
		if (activityTssStyles[activityTssKey] && activityTssStyles[activityTssKey].style) {
			_.defaults(xmlStyles, activityTssStyles[activityTssKey].style);
		}
		// Generate the template code
		if ((_.filter(_.values(xmlStyles), function(val) { return val !== undefined; })).length > 0) {
			code += state.parent.symbol + '.activity.setSupportActionBar($.__views.' + node.getAttribute('id') + ');';
			if (xmlStyles.backgroundImage)  { code += state.parent.symbol + '.activity.actionBar.backgroundImage = "' + xmlStyles.backgroundImage + '";'; }
			if (xmlStyles.displayHomeAsUp)  { code += state.parent.symbol + '.activity.actionBar.displayHomeAsUp = ' + xmlStyles.displayHomeAsUp + ';'; }
			if (xmlStyles.homeButtonEnabled)  { code += state.parent.symbol + '.activity.actionBar.homeButtonEnabled = ' + xmlStyles.homeButtonEnabled + ';'; }
			if (xmlStyles.navigationMode)  { code += state.parent.symbol + '.activity.actionBar.navigationMode = ' + xmlStyles.navigationMode + ';'; }
			if (xmlStyles.onHomeIconItemSelected)  { code += state.parent.symbol + '.activity.actionBar.onHomeIconItemSelected = ' + xmlStyles.onHomeIconItemSelected + ';'; }
		}

		tempRes.code += U.evaluateTemplate('Ti.Android.ActionBar.js', {
			parent: state.parent.symbol || CONST.PARENT_SYMBOL_VAR,
			code: code,
			eventObject: eventObject,
			openFunc: CU.generateUniqueId()
		});
	}
	return {
		parent: {},
		styles: tempRes.styles,
		code: tempRes.code
	};
};
