var babylon = require('babylon'),
	types = require('babel-types'),
	traverse = require('babel-traverse').default,
	CONST = require('../../../common/constants'),
	_ = require('../../../lib/alloy/underscore')._;

// Use options to babili's minify-replace plugin to replace certain values with literals?
// https://github.com/babel/babili/tree/master/packages/babel-plugin-minify-replace

exports.process = function(ast, config) {
	config = config ? config.alloyConfig : {};
	config.deploytype = config.deploytype || 'development';

	// create list of platform and deploy type defines
	var defines = {};
	_.each(CONST.DEPLOY_TYPES, function(d) {
		defines[d.key] = config.deploytype === d.value;
	});
	_.each(CONST.DIST_TYPES, function(d) {
		defines[d.key] = _.contains(d.value, config.target);
	});
	_.each(CONST.PLATFORMS, function(p) {
		defines['OS_' + p.toUpperCase()] = config.platform === p;
	});

	traverse(ast, {
		enter(path) {
			if (types.isIdentifier(path.node) && defines.hasOwnProperty(path.node.name)) {
				path.replaceWith(types.booleanLiteral(defines[path.node.name]));
			}
		}
	});
	return ast;
};
