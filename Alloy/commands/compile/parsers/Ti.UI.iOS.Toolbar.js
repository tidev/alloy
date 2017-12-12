var _ = require('../../../lib/alloy/lodash')._;

exports.parse = function(node, state) {
	state = _.extend(state, {
		itemContainerDefinition: {
			children: [
				{ name:'Alloy.Abstract.Items', property:'items' }
			]
		}
	});
	return require('./Alloy.Abstract._ItemContainer').parse(node, state);
};
