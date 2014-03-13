var _ = require('../../../lib/alloy/underscore')._;

exports.parse = function(node, state) {
	_.extend(state, {
		proxyPropertyDefinition: {
			parents: [
				'Ti.UI.TableView',
				'Ti.UI.TableViewSection',
				'Ti.UI.ListView',
				'Ti.UI.ListSection'
			]
		}
	});
	return require('./_ProxyProperty').parse(node, state);
};