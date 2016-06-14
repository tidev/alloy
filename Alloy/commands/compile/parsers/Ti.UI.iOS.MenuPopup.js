var _ = require('../../../lib/alloy/underscore')._;

exports.parse = function(node, state) {
	state = _.extend(state, {
		itemContainerDefinition: {
			children: [
				{ name:'Alloy.Abstract.Items', property:'items' }
			],
			androidView: false,
			inViewHierarchy: false
		}
	});
	return require('./Alloy.Abstract._ItemContainer').parse(node, state);
};
