var CONST = require('../../../common/constants'),
	_ = require('lodash'),
	path = require('path'),
	fs = require('fs'),
	{ Visitor } = require('@swc/core/Visitor');

// Walk tree transformer changing (Ti|Titanium).Platform.(osname|name)
// into static strings where possible. This will allow the following
// compression step to reduce the code further.
function isTiPlatform(member, parts) {
	if (member.type !== 'MemberExpression') {
		return false;
	}

	const nodes = [];
	let n;
	for (n = member; n.type === 'MemberExpression'; n = n.object) {
		nodes.push(n.property);
	}
	nodes.push(member.object);

	if (nodes.length !== 2) {
		return false;
	}

	for (let i = 0, j = nodes.length - 1; i < parts.length; i++, j--) {
		const node = nodes[j];
		let value;
		if (node.type === 'Identifier' || node.type === 'StringLiteral') {
			value = node.value;
		} else if (node.type === 'ThisExpression') {
			value = 'this';
		} else {
			return false;
		}
	
		if (parts[i] !== value) {
			return false;
		}
	}
	return true;
}

module.exports = class Optimizer extends Visitor {
	constructor(alloyConfig) {
		super();
		this.defines = {};
		this.dirty = false;

		alloyConfig.deploytype = alloyConfig.deploytype || 'development';


		for (const deployType of CONST.DEPLOY_TYPES) {
			this.defines[deployType.key] = alloyConfig.deployType === deployType.value;
		}

		for (const distType of CONST.DIST_TYPES) {
			this.defines[distType.key] = distType.value.includes(alloyConfig.target);
		}

		for (const platform of CONST.PLATFORMS) {
			this.defines[`OS_${platform.toUpperCase()}`] = alloyConfig.platform === platform;
		}

		var platformString = alloyConfig.platform.toLowerCase();
		var platformPath = path.join(__dirname, '..', '..', '..', '..', 'platforms', platformString, 'index');
		if (!fs.existsSync(platformPath + '.js')) {
			this.platform = {name: undefined, osname: undefined };
		} else {
			// create, transform, and validate the platform object
			this.platform = require(platformPath);
			if (!_.isString(this.platform.name)) { this.platform.name = undefined; }
			if (!_.isString(this.platform.osname)) { this.platform.osname = undefined; }
		}

	}

	visitMemberExpression(node) {
		let name;
		if (node.property.type === 'StringLiteral' || node.property.type === 'Identifier') {
			name = node.property.value;
		} else if (node.property.type === 'Computed') {
			name = node.property.expression.value;
		} else {
			return;
		}

		if ((name === 'name' || name === 'osname') && this.platform[name]) {
			if (isTiPlatform(node.object, ['Ti', 'Platform']) || isTiPlatform(node.object, ['Titanium', 'Platform'])) {
				this.dirty = true;
				return {
					...node,
					type: 'StringLiteral',
					span: node.span,
					value: this.platform[name]
				};
			}
		}

		return super.visitMemberExpression(node);
	}

	visitIdentifier(node) {
		const name = node.value;

		if (Object.hasOwn(this.defines, name)) {
			this.dirty = true;
			return {
				...node,
				type: 'BooleanLiteral',
				span: node.span,
				value: this.defines[name]
			};
		}

		return super.visitIdentifier(node);
	}
};