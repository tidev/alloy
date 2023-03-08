const _ = require('lodash');

exports.parse = function(node, state) {
	_.extend(state, {
		proxyPropertyDefinition: {
			parents: [
				'Ti.UI.Android.CollapseToolbar'
			]
		}
	});
	return require('./Alloy.Abstract._ProxyProperty').parse(node, state);
};
