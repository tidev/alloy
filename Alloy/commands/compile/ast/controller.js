var U = require('../../../utils'),
	babylon = require('babylon'),
	types = require('babel-types'),
	generate = require('babel-generator').default,
	traverse = require('babel-traverse').default;

var isBaseControllerExportExpression = types.buildMatchMemberExpression('exports.baseController');

exports.processController = function(code, file) {
	var baseController = '',
		moduleCodes = '',
		newCode = '',
		exportSpecifiers = [];

	try {
		var ast = babylon.parse(code, { sourceFilename: file, sourceType: 'module' });
		traverse(ast, {
			enter: function(path) {
				if (types.isAssignmentExpression(path.node) && isBaseControllerExportExpression(path.node.left)) {
					// what's equivalent of print_to_string()? I replaced with simple value property assuming it's a string literal
					baseController = '\'' + path.node.right.value + '\'';
				}
			},

			ImportDeclaration: function(path) {
				moduleCodes += generate(path.node, {}).code;
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
				moduleCodes += generate(node, {}).code;
				path.remove();
			}
		});

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
						moduleCodes += generate(node, {}).code;
						path.remove();
					}
				}
			});
		}

		newCode = generate(ast, {}).code;
	} catch (e) {
		U.die('Error generating AST for "' + file + '"', e);
	}

	return {
		es6mods: moduleCodes,
		base: baseController,
		code: newCode
	};
};
