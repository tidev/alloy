var _ = require('lodash');

exports.parse = function(node, state) {
	_.extend(state, {
		proxyPropertyDefinition: {
			parents: [
				'Ti.Android.Menu'
			]
		}
	});
	return require('./_ProxyProperty').parse(node, state);
};
