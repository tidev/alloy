const tiapp = require('../../../tiapp');
const CU = require('../compilerUtils');
const U = require('../../../utils');

exports.parse = function(node, state) {
	return require('./Ti.UI.ButtonBar').parse(node, state);
};
