var path = require('path'),
	fs = require('fs'),
	_ = require('../../../lib/alloy/underscore')._,
	uglifyjs = require('uglify-js'),
	logger = require('../../../logger'),
	U = require('../../../utils');

var EXCLUDE = ['backbone','CFG','underscore'];
var BUILTINS_PATH = path.join(__dirname,'..','..','..','builtins');
var loaded = [];

function appendExtension(file, extension) {
	extension = '.' + extension;
	file = U.trim(file);

	var len = extension.length;
	if (file.substring(file.length - extension.length) !== extension) {
		return file + extension;
	} else {
		return file;
	}
}

exports.process = function(ast, config) {
	var rx = /^(alloy)\/(.+)$/;
	var match;

	ast.walk(new uglifyjs.TreeWalker(function(node) {
		if (node instanceof uglifyjs.AST_Call) {
			var theString = node.args[0];
			if (node.expression.name === 'require' &&            // Is this a require call?
				theString && _.isString(theString.value) &&      // Is the 1st param a literal string?
				(match = theString.value.match(rx)) !== null &&  // Is it an alloy module?
				!_.contains(EXCLUDE, match[2]) &&                // Make sure it's not excluded.
				!_.contains(loaded, match[2])                    // Make sure we didn't find it already               
			) {
				// Make sure it hasn't already been copied to Resources
				var name = appendExtension(match[2], 'js');
				if (fs.existsSync(path.join(config.dir.resources,match[1],name))) {
					return;
				}

				// make sure the builtin exists
				var source = path.join(BUILTINS_PATH,name);
				if (!path.existsSync(source)) {
					return;
				}

				var dest = path.join(config.dir.resources,'alloy',name);
				logger.debug('  - [' + name + '] --> "' + dest + '"');
				U.copyFileSync(source, dest);

				loaded = _.union(loaded, [name]);
			}
		}
	}));
	return ast;
}