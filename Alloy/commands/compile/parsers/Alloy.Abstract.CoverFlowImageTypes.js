var _ = require('../../../lib/alloy/underscore')._; 

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
			]
		}
	});
	return require('./Alloy.Abstract._ItemArray').parse(node, state);
};