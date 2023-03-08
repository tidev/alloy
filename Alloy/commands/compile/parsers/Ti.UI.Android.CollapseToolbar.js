const _ = require('lodash'),
	U = require('../../../utils'),
	MIN_VERSION = '12.1.0';

exports.parse = function(node, state) {
	return require('./base').parse(node, state, parse);
};

function parse(node, state, args) {
	const tiappSdkVersion = tiapp.getSdkVersion();
	if (tiapp.version.lt(tiappSdkVersion, MIN_VERSION)) {
		U.die(`Ti.UI.Android.CollapseToolbar requires Titanium SDK ${MIN_VERSION}+`);
	}

	var children = U.XML.getElementsFromNodes(node.childNodes),
		code = '',
		extras = [],
		proxyProperties = {};

	// add all proxy properties at creation time
	_.each(proxyProperties, function(v, k) {
		extras.push([k, v]);
	});

	// if we got any extras, add them to the state
	if (extras.length) {
		state.extraStyle = styler.createVariableStyle(extras);
	}

	viewState = require('./default').parse(node, state);
	viewState.code = code + viewState.code;

	return viewState;
}
