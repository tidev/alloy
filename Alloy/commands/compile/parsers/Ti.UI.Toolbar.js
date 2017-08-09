var _ = require('../../../lib/alloy/underscore')._,
	U = require('../../../utils'),
	CU = require('../compilerUtils');

exports.parse = function(node, state) {
	var eventObject = 'e',
		code = '',
		xmlStyles = {};
	//properties inheritted from ActionBar when Toolbar is passed to the activity as one
	var inheritedProperties = ['backgroundImage', 'displayHomeAsUp', 'homeButtonEnabled', 'navigationMode', 'onHomeItemSelected'];

	state = _.extend(state, {
		itemContainerDefinition: {
			children: [
				{ name:'Alloy.Abstract.Items', property:'items' }
			]
		}
	});


	var tempRes = require('./Alloy.Abstract._ItemContainer').parse(node, state);

	//Only if the toolbar is passed as an ActionBar to the activity
	if (state.parent.node.getAttribute('customToolbar') === node.getAttribute('id')) {

		var activityTssStyles = _.filter(state.styles, function(elem) {
			// generates a sorted array of styles filtered to include only elements
			// associated with the activity (by ID, class, or API name)
			return elem.key === node.getAttribute('id') || elem.key === node.getAttribute('class') || elem.key === node.nodeName;
		});
		// create an object holding all the actionBar-related properties set in the XML
		_.each(inheritedProperties, function(prop) {
			if (node.hasAttribute(prop)) {
				xmlStyles[prop] = node.getAttribute(prop);
			}
		});
		// to respect proper style hierarchy, take the last element in the array (which will be the highest priority)
		var activityTssKey = _.isArray(activityTssStyles) ? activityTssStyles.length - 1 : 0;
		if (activityTssStyles[activityTssKey] && activityTssStyles[activityTssKey].style) {
			_.defaults(xmlStyles, activityTssStyles[activityTssKey].style);
		}
		// generate the template code
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