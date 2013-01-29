var _ = require('../../../lib/alloy/underscore')._;

exports.parse = function(node, state) {
	_.extend(state, {
		proxyPropertyDefinition: {
			parents: [
				'Ti.UI.TableView',
				'Ti.UI.TableViewSection'
			]
		}
	});
	return require('./Alloy.Abstract._ProxyProperty').parse(node, state);
};