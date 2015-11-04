var U = require('../../../utils'),
	uglifyjs = require('uglify-js');

exports.getBaseController = function(code, file) {
	var baseController = '"BaseController"';

	try {
		var ast = uglifyjs.parse(code);
		ast.walk(new uglifyjs.TreeWalker(function(node) {
			if (node instanceof uglifyjs.AST_Assign) {
				var left = node.left.print_to_string();
				if (left === 'exports.baseController' ||
					left === 'exports["baseController"]' ||
					left === "exports['baseController']") {
					baseController = node.right.print_to_string();
				}
			}
		}));
	} catch (e) {
		U.die('Error generating AST for "' + file + '"', e);
	}

	return baseController;
};

exports.getRequiredControllers = function (code, file) {
	var requiredFiles = [];

	try {
		var ast = uglifyjs.parse(code);
		ast.walk(new uglifyjs.TreeWalker(function(node) {
			if (node instanceof uglifyjs.AST_Call) {
				if (node.start.value === 'Alloy' &&
					node.expression.property === 'createController' &&
					node.args[0].value) {
						requiredFiles.push(node.args[0].value);
					}
			}
		}));
	} catch (e) {
		U.die('Error generating AST for "' + file + '"', e);
	}

	return requiredFiles;
};
