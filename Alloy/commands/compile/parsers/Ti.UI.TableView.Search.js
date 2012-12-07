var _ = require('../../../lib/alloy/underscore')._;

exports.parse = function(node, state) {
	_.extend(state, {
		proxyPropertyDefinition: {
			parents: [
				'Ti.UI.TableView'
			],
			children: [
				'Ti.UI.SearchBar'
			]
		}
	});
	return require('./Alloy.Abstract._ProxyProperty').parse(node, state);
};