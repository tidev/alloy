var _ = require('../../../lib/alloy/underscore')._;

exports.parse = function(node, state) {
	state = _.extend(state, {
		itemContainerDefinition: {
			children: [
				{ name:'Alloy.Abstract.ButtonNames', property:'buttonNames' },
				{ name:'Alloy.Abstract.Options', property:'options' }
			],
			androidView: true,
			inViewHierarchy: false
		}
	});
	return require('./Alloy.Abstract._ItemContainer').parse(node, state);
};