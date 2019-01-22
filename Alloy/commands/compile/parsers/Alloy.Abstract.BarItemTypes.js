var _ = require('lodash');

exports.parse = function(node, state) {
	_.extend(state, {
		itemArrayDefinition: {
			parents: [
				'Ti.UI.ButtonBar',
				'Ti.UI.iOS.TabbedBar',
				'Ti.UI.TabbedBar'
			],
			children: [
				'Alloy.Abstract.BarItemType'
			],
			translations: [
				{ from: 'Ti.UI.Label', to: 'Alloy.Abstract.BarItemType' }
			],
			property: 'labels'
		}
	});
	return require('./Alloy.Abstract._ItemArray').parse(node, state);
};
