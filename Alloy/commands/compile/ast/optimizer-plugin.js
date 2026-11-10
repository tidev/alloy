var CONST = require('../../../common/constants'),
	types = require('@babel/types'),
	_ = require('lodash'),
	path = require('path'),
	fs = require('fs');

var isTiPlatform = types.buildMatchMemberExpression('Ti.Platform');
var isTitaniumPlatform = types.buildMatchMemberExpression('Titanium.Platform');

// Walk tree transformer changing (Ti|Titanium).Platform.(osname|name)
// into static strings where possible. This will allow the following
// compression step to reduce the code further.
module.exports = function (config) {
	config = config || {};
	config.deploytype = config.deploytype || 'development';

	// create list of platform and deploy type defines
	var defines = {};
	_.each(CONST.DEPLOY_TYPES, function(d) {
		defines[d.key] = config.deploytype === d.value;
	});
	_.each(CONST.DIST_TYPES, function(d) {
		defines[d.key] = _.includes(d.value, config.target);
	});
	_.each(CONST.PLATFORMS, function(p) {
		defines['OS_' + p.toUpperCase()] = config.platform === p;
	});

	// make sure the platform require includes
	var platform;
	var platformString = config.platform.toLowerCase();
	var platformPath = path.join(__dirname, '..', '..', '..', '..', 'platforms', platformString, 'index');
	if (!fs.existsSync(platformPath + '.js')) {
		platform = {name: undefined, osname: undefined };
	} else {
		// create, transform, and validate the platform object
		platform = require(platformPath);
		if (!_.isString(platform.name)) { platform.name = undefined; }
		if (!_.isString(platform.osname)) { platform.osname = undefined; }
	}

	return {
		MemberExpression: function(p) {
			var name = '';
			if (types.isStringLiteral(p.node.property)) {
				name = p.node.property.value;
			} else if (types.isIdentifier(p.node.property)) {
				name = p.node.property.name;
			} else {
				return;
			}

			if ((name === 'name' || name === 'osname') && platform[name]) {
				if (isTiPlatform(p.node.object) || isTitaniumPlatform(p.node.object)) {
					p.replaceWith(types.stringLiteral(platform[name]));
				}
			}
		},
		Identifier: function(p) {
			if (Object.prototype.hasOwnProperty.call(defines, p.node.name) &&
				(p.parent.type !== 'VariableDeclarator' || p.node.name !== p.parent.id.name)) {
				p.replaceWith(types.booleanLiteral(defines[p.node.name]));
			}
		}
	};
};
