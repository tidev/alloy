var U = require('../../../utils'),
	swc = require('@swc/core'),
	{ Visitor } = require('@swc/core/Visitor');

exports.processController = function(code, file) {
	var baseController = '',
		moduleCodes = '',
		newCode = '',
		exportSpecifiers = [],
		es6mods;

	try {
		const x = swc.parseSync(code);
		const plugin = new ProcessController();
		plugin.visitModule(x);
		newCode = swc.printSync(x).code;
		es6mods = plugin.moduleCodes;
	} catch (e) {
		U.dieWithCodeFrame('Error generating AST for "' + file + '". Unexpected token at line ' + e.loc.line + ' column ' + e.loc.column, e.loc, code);
	}

	return {
		es6mods: es6mods,
		base: baseController,
		code: newCode
	};
};

class ProcessController extends Visitor {
	constructor() {
		super();

		this.moduleCodes = '';

	}

	visitAssignmentExpression(node) {
		if (node.left.property.value === 'baseController') {
			baseController = node.right.raw;
		}
		return super.visitAssignmentExpression(node);
	}

	visitModuleItems(nodes) {
		const transformed = [];
		for (const node of nodes) {

			if (node.type !== 'ImportDeclaration' && node.type !== 'ExportDeclaration') {
				transformed.push(node);
				continue;
			}
			const mod = swc.printSync({
				type:'Module',
				body: [node],
				span: node.span
			});
			this.moduleCodes += mod.code;
		}

		return transformed;
	}
}
