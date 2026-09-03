var U = require('../../../utils'),
	babylon = require('@babel/parser'),
	types = require('@babel/types'),
	generate = require('@babel/generator').default,
	{ default: traverse, Hub, NodePath } = require('@babel/traverse');

var isBaseControllerExportExpression = types.buildMatchMemberExpression('exports.baseController');

let GENCODE_OPTIONS = {
	retainLines: true
};

exports.processController = function(code, file, isProduction = false) {
	var baseController = '',
		moduleCodes = '',
		newCode = '';

	if (isProduction) {
		GENCODE_OPTIONS.retainLines = false;
	}

	function buildExportAssignment(exportedName, localName) {
		return types.expressionStatement(
			types.assignmentExpression(
				'=',
				types.memberExpression(types.identifier('exports'), types.identifier(exportedName)),
				types.identifier(localName)
			)
		);
	}

	try {
		var ast = babylon.parse(code, { sourceFilename: file, sourceType: 'unambiguous' });

		const hub = new Hub();
		hub.buildError = function (node, message, Error) {
			const loc = node && node.loc;
			const err = new Error(message);

			if (loc) {
				err.loc = loc.start;
			}

			return err;
		};
		const path = NodePath.get({
			hub: hub,
			parent: ast,
			container: ast,
			key: 'program'
		}).setContext();
		traverse(ast, {
			enter: function(path) {
				if (types.isAssignmentExpression(path.node) && isBaseControllerExportExpression(path.node.left)) {
					// what's equivalent of print_to_string()? I replaced with simple value property assuming it's a string literal
					baseController = '\'' + path.node.right.value + '\'';
				}
			},

			ImportDeclaration: function(path) {
				moduleCodes += generate(path.node, GENCODE_OPTIONS).code;
				path.remove();
			},

			ExportNamedDeclaration: function(path) {
				var node = path.node;

				// Re-exports from another module (e.g. `export { foo } from './bar'`) are true
				// module-level constructs — hoist them out of the controller body.
				if (node.source) {
					moduleCodes += generate(node, GENCODE_OPTIONS).code;
					path.remove();
					return;
				}

				// `export function show() {}`, `export const show = ...`, `export class X {}`
				if (node.declaration) {
					var decl = node.declaration;
					var replacements = [decl];
					if (decl.type === 'FunctionDeclaration' || decl.type === 'ClassDeclaration') {
						if (decl.id && decl.id.name) {
							replacements.push(buildExportAssignment(decl.id.name, decl.id.name));
						}
					} else if (decl.type === 'VariableDeclaration') {
						decl.declarations.forEach(function (d) {
							if (d.id && d.id.name) {
								replacements.push(buildExportAssignment(d.id.name, d.id.name));
							}
						});
					}
					path.replaceWithMultiple(replacements);
					return;
				}

				// `export { show }` or `export { show as displayShow }` — locally declared
				// bindings get attached to the controller's local `exports` object.
				if (node.specifiers && node.specifiers.length !== 0) {
					var assignments = node.specifiers
						.filter(function (specifier) { return specifier.local && specifier.local.name; })
						.map(function (specifier) {
							var localName = specifier.local.name;
							var exportedName = (specifier.exported && specifier.exported.name) || localName;
							return buildExportAssignment(exportedName, localName);
						});
					path.replaceWithMultiple(assignments);
					return;
				}

				// Fallback: leave as-is at module level.
				moduleCodes += generate(node, GENCODE_OPTIONS).code;
				path.remove();
			}
		}, path.scope);

		newCode = generate(ast, GENCODE_OPTIONS).code;
	} catch (e) {
		U.dieWithCodeFrame('Error generating AST for "' + file + '". Unexpected token at line ' + e.loc.line + ' column ' + e.loc.column, e.loc, code);
	}

	return {
		es6mods: moduleCodes,
		base: baseController,
		code: newCode
	};
};
