var _ = require('../../../lib/alloy/underscore')._;

exports.parse = function(node, state) {
	_.extend(state, {
		proxyPropertyDefinition: {
			parents: [
				'Ti.UI.TextField',
				'Ti.UI.TextArea'
			]
		}
	});
	return require('./_ProxyProperty').parse(node, state);
};
