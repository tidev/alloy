var _ = require('../../../lib/alloy/underscore')._;

exports.parse = function(node, state) {
	_.extend(state, {
		itemArrayDefinition: {
			parents: [
				'Ti.UI.iOS.Toolbar'
			],
			children: [
				'ALL'
			],
			property: 'items'
		}
	});
	return require('./Alloy.Abstract._ItemArray').parse(node, state);
};