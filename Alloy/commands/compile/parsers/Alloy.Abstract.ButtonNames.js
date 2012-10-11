var _ = require('../../../lib/alloy/underscore')._; 

exports.parse = function(node, state) {
	_.extend(state, {
		itemArrayDefinition: {
			parents: [
				'Ti.UI.AlertDialog',
				'Ti.UI.OptionDialog'
			],
			children: [
				'Alloy.Abstract.ButtonName'
			]
		}
	});
	return require('./Alloy.Abstract._ItemArray').parse(node, state);
};