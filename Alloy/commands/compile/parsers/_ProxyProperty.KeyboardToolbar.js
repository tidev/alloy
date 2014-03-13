var _ = require('../../../lib/alloy/underscore')._;

exports.parse = function(node, state) {
	_.extend(state, {
		proxyPropertyDefinition: {
			parents: [
				'Ti.UI.TextField'
			]
		}
	});
	return require('./_ProxyProperty').parse(node, state);
};