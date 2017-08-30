var _ = require('../../../lib/alloy/underscore')._;

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
