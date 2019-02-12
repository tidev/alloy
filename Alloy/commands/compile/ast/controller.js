var U = require('../../../utils'),
	babylon = require('@babel/parser'),
	types = require('@babel/types'),
	generate = require('@babel/generator').default,
	{ default: traverse, Hub, NodePath } = require('@babel/traverse');

var isBaseControllerExportExpression = types.buildMatchMemberExpression('exports.baseController');

const GENCODE_OPTIONS = {
	retainLines: true
};

exports.processController = function(code, file) {
	var baseController = '',
		moduleCodes = '',
		newCode = '',
		exportSpecifiers = [];

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
				var specifiers = node.specifiers;
				if (specifiers && specifiers.length !== 0) {
					specifiers.forEach(function (specifier) {
						if (specifier.local && specifier.local.name) {
							exportSpecifiers.push(specifier.local.name);
						}
					});
				}
				moduleCodes += generate(node, GENCODE_OPTIONS).code;
				path.remove();
			}
		}, path.scope);

		if (exportSpecifiers.length > 0) {
			traverse(ast, {
				enter: function(path) {
					var node = path.node,
						name;
					if (node.type === 'VariableDeclaration') {
						name = node.declarations[0].id.name;
					} else if (node.type === 'FunctionDeclaration' || node.type === 'ClassDeclaration') {
						name = node.id.name;
					}

					if (exportSpecifiers.indexOf(name) !== -1) {
						moduleCodes += generate(node, GENCODE_OPTIONS).code;
						path.remove();
					}
				}
			});
		}

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
