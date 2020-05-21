const _ = require('lodash');
const { platforms } = require('alloy-utils');

module.exports = _.omit(platforms, ['constants']);