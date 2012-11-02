var _ = require('../../../lib/alloy/underscore')._;

exports.parse = function(node, state) {
	state = _.extend(state, {
		itemContainerDefinition: {
			children: [
				{ name:'Alloy.Abstract.CoverFlowImageTypes', property:'images' }
			],
			translations: [
				{ from: 'Alloy.Abstract.Images', to: 'Alloy.Abstract.CoverFlowImageTypes' }
			]
		}
	});
	return require('./Alloy.Abstract._ItemContainer').parse(node, state);
};