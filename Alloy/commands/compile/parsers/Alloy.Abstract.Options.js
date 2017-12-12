var _ = require('lodash');

exports.parse = function(node, state) {
	_.extend(state, {
		itemArrayDefinition: {
			parents: [
				'Ti.UI.OptionDialog'
			],
			children: [
				'Alloy.Abstract.Option'
			],
			property: 'options'
		}
	});
	return require('./Alloy.Abstract._ItemArray').parse(node, state);
};
