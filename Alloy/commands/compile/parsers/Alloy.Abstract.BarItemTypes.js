var _ = require('../../../lib/alloy/underscore')._; 

exports.parse = function(node, state) {
	_.extend(state, {
		itemArrayDefinition: {
			parents: [
				'Ti.UI.ButtonBar',
				'Ti.UI.iOS.TabbedBar'
			],
			children: [
				'Alloy.Abstract.BarItemType'
			],
			translations: [
				{ from: 'Ti.UI.Label', to: 'Alloy.Abstract.BarItemType' }
			]
		}
	});
	return require('./Alloy.Abstract._ItemArray').parse(node, state);
};