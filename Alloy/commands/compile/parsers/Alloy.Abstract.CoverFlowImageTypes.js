var _ = require('lodash');

exports.parse = function(node, state) {
	state = _.extend(state, {
		itemArrayDefinition: {
			parents: [
				'Ti.UI.iOS.CoverFlowView'
			],
			children: [
				'Alloy.Abstract.CoverFlowImageType'
			],
			translations: [
				{ from: 'Ti.UI.Image', to: 'Alloy.Abstract.CoverFlowImageType' }
			],
			property: 'images'
		}
	});
	return require('./Alloy.Abstract._ItemArray').parse(node, state);
};
