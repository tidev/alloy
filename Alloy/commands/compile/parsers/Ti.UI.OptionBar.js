const _ = require('lodash');
const tiapp = require('../../../tiapp');
const U = require('../../../utils');

exports.parse = function(node, state) {
	return require('./Ti.UI.ButtonBar').parse(node, state);
};
