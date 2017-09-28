var _ = require('../../../lib/alloy/underscore')._;

exports.parse = function(node, state) {
	_.extend(state, {
		itemArrayDefinition: {
			parents: [
				'Ti.UI.Toolbar',
				'Ti.UI.iOS.MenuPopup'
			],
			children: [
				'ALL'
			],
			property: 'items'
		}
	});
	return require('./Alloy.Abstract._ItemArray').parse(node, state);
};
