var _ = require('lodash');

exports.parse = function(node, state) {
	console.log(' Ti.UI.Android.DrawerLayout');
	_.extend(state, {
		proxyPropertyDefinition: {
			parents: [
				'Ti.UI.Android.DrawerLayout'
			]
		}
	});
	return require('./Alloy.Abstract._ProxyProperty').parse(node, state);
};
