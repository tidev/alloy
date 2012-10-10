var _ = require('../../../lib/alloy/underscore')._,
	U = require('../../../utils'),
	CU = require('../compilerUtils'); 

var VALID = [
	'Ti.UI.OptionDialog',
	'Ti.UI.AlertDialog'
];

exports.parse = function(node, state) {
	return require('./base').parse(node, state, parse);
};

function parse(node, state, args) {
	if (!state.buttonNameArray) {
		U.die([
			'Invalid use of <ButtonNames>.', 
			'Must be the child one of the following: [' + VALID.join(',') + ']'
		]);
	}

	return _.extend(state, {
		parent: { node: node },
		code: 'var ' + state.buttonNameArray + ' = [];'
	});
}