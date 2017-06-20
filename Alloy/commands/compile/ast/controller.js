var U = require('../../../utils'),
	babylon = require('babylon'),
	types = require('babel-types'),
	traverse = require('babel-traverse').default;

var isBaseControllerExportExpression = types.buildMatchMemberExpression('exports.baseController');

exports.getBaseController = function(code, file) {
	var baseController = '';

	try {
		var ast = babylon.parse(code, { sourceFilename: file, sourceType: 'module' });
		traverse(ast, {
			enter: function(path) {
				if (types.isAssignmentExpression(path.node) && isBaseControllerExportExpression(path.node.left)) {
					// what's equivalent of print_to_string()? I replaced with simple value property assuming it's a string literal
					baseController = path.node.right.value;
				}
			}
		});
	} catch (e) {
		U.die('Error generating AST for "' + file + '"', e);
	}

	return baseController;
};
