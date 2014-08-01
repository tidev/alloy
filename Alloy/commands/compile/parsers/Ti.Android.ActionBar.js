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
		code = '',
		xmlStyles = {},
		actionBarProperties = ['title', 'subtitle', 'backgroundImage', 'displayHomeAsUp', 'homeButtonEnabled', 'icon', 'logo', 'navigationMode', 'onHomeIconItemSelected'];

	// if this isn't android, generate no code, but show a warning
	var config = CU.getCompilerConfig(),
		platform = config && config.alloyConfig ? config.alloyConfig.platform : undefined;
	if (platform !== 'android') {
		if (node.getAttribute('platform') !== 'android') {
			logger.warn([
				'<Activity> is only available in Android',
				'To get rid of this warning, add platform="android" to your <Activity> element'
			]);
		}
		return {
			parent: {},
			styles: state.styles,
			code: ''
		};
	}

	var activityTssStyles = _.filter(state.styles, function(elem) {
			// generates a sorted array of styles filtered to include only elements
			// associated with the activity (by ID, class, or API name)
			return elem.key === node.getAttribute('id') || elem.key === node.getAttribute('class') || elem.key === node.nodeName;
		});
	// create an object holding all the actionBar-related properties set in the XML
	_.each(actionBarProperties, function(prop) {
		if(node.hasAttribute(prop)) {
			xmlStyles[prop] = node.getAttribute(prop);
		}
	})
	// to respect proper style hierarchy, take the last element in the array (which will be the highest priority)
	var activityTssKey = _.isArray(activityTssStyles) ? activityTssStyles.length-1 : 0;
	if(activityTssStyles[activityTssKey] && activityTssStyles[activityTssKey].style) {
		_.defaults(xmlStyles, activityTssStyles[activityTssKey].style);
	}
	// generate the template code
	if((_.filter(_.values(xmlStyles), function(val) { return val !== undefined; })).length > 0) {
		if(xmlStyles.title)  { code += state.parent.symbol + '.activity.actionBar.title = "' + xmlStyles.title + '";'; }
		if(xmlStyles.subtitle)  { code += state.parent.symbol + '.activity.actionBar.subtitle = "' + xmlStyles.subtitle + '";'; }
		if(xmlStyles.backgroundImage)  { code += state.parent.symbol + '.activity.actionBar.backgroundImage = "' + xmlStyles.backgroundImage + '";'; }
		if(xmlStyles.displayHomeAsUp)  { code += state.parent.symbol + '.activity.actionBar.displayHomeAsUp = ' + xmlStyles.displayHomeAsUp + ';'; }
		if(xmlStyles.homeButtonEnabled)  { code += state.parent.symbol + '.activity.actionBar.homeButtonEnabled = ' + xmlStyles.homeButtonEnabled + ';'; }
		if(xmlStyles.icon)  { code += state.parent.symbol + '.activity.actionBar.icon = "' + xmlStyles.icon + '";'; }
		if(xmlStyles.logo)  { code += state.parent.symbol + '.activity.actionBar.logo = "' + xmlStyles.logo + '";'; }
		if(xmlStyles.navigationMode)  { code += state.parent.symbol + '.activity.actionBar.navigationMode = ' + xmlStyles.navigationMode + ';'; }
		if(xmlStyles.onHomeIconItemSelected)  { code += state.parent.symbol + '.activity.actionBar.onHomeIconItemSelected = ' + xmlStyles.onHomeIconItemSelected + ';'; }
	}
	// Update the parsing state, and process the template
	return {
		parent: {},
		styles: state.styles,
		code: U.evaluateTemplate('Ti.Android.ActionBar.js', {
			parent: state.parent.symbol || CONST.PARENT_SYMBOL_VAR,
			code: code,
			eventObject: eventObject,
			openFunc: CU.generateUniqueId()
		})
	};
}
