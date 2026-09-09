const parser = require('@babel/parser'),
	traverseModule = require('@babel/traverse'),
	generate = require('@babel/generator').default,
	builtinsVisitor = require('./builtins-plugin'),
	optimizerVisitor = require('./optimizer-plugin');

const traverse = traverseModule.default;

const SOURCE_MAP_COMMENT = /\n?\/\/# sourceMappingURL=[^\n]*$/;

/*
 * @method createVisitor
 * Builds the merged visitor used by both call sites.
 *
 * @param {Object} compileConfig Alloy's compile config, for the builtins visitor
 * @param {Object} alloyConfig The alloyConfig (platform/deploytype/target), for the optimizer
 * @return {Object} A @babel/traverse visitor
 */
exports.createVisitor = function(compileConfig, alloyConfig) {
	return traverseModule.visitors.merge([
		builtinsVisitor(compileConfig),
		optimizerVisitor(alloyConfig)
	]);
};

/*
 * @method parse
 * Parses code with the options Alloy needs. Throws on a syntax error; callers
 * report it with U.dieWithCodeFrame().
 */
exports.parse = function(code, filename) {
	return parser.parse(code, {
		sourceFilename: filename,
		sourceType: 'unambiguous',
		allowReturnOutsideFunction: true
	});
};

/*
 * @method stripSourceMapComment
 * Removes a trailing //# sourceMappingURL= comment, as @babel/core did.
 */
exports.stripSourceMapComment = function(code) {
	return code.replace(SOURCE_MAP_COMMENT, '');
};

/*
 * @method run
 * Applies the visitor to the AST in place and prints it.
 *
 * @param {Object} ast The AST to transform, mutated in place
 * @param {String} code The original source, used by the generator
 * @param {Object} visitor A visitor from createVisitor()
 * @param {Object} options sourceMapper.OPTIONS_OUTPUT, or a clone of it
 * @return {String} The generated code
 */
exports.run = function(ast, code, visitor, options) {
	traverse(ast, visitor);
	return generate(ast, options, code).code;
};