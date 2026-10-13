const parser = require('@babel/parser'),
	traverse = require('@babel/traverse').default,
	generate = require('@babel/generator').default,
	_ = require('lodash'),
	builtinsVisitor = require('./builtins-plugin'),
	optimizerVisitor = require('./optimizer-plugin'),
	CONST = require('../../../common/constants');

// Every identifier the optimizer visitor can fold, built from the same
// constants it builds its defines from, plus any reference to Ti.Platform /
// Titanium.Platform. The visitor folds Ti.Platform.name, Ti.Platform['osname']
// and so on, so only the object is matched here: dotted or bracketed, with
// whitespace allowed around the dot. A file containing none of these cannot
// be changed by it.
//
// Built on first use: constants -> platforms -> utils -> sourceMapper -> here
// is a require cycle, so CONST may still be half-loaded when this module is.
let optimizeRx;
function getOptimizeRx() {
	if (!optimizeRx) {
		optimizeRx = new RegExp(
			'\\b(?:' + []
				.concat(_.map(CONST.DEPLOY_TYPES, 'key'))
				.concat(_.map(CONST.DIST_TYPES, 'key'))
				.concat(_.map(CONST.PLATFORMS, function(p) { return 'OS_' + p.toUpperCase(); }))
				.join('|') + ')\\b'
			+ '|\\bTi(?:tanium)?\\s*(?:\\.\\s*Platform\\b|\\[\\s*[\'"]Platform[\'"])'
		);
	}
	return optimizeRx;
}

// What the builtins visitor looks for: require('alloy/x') or require('/alloy/x').
const ALLOY_REQUIRE_RX = /require\s*\(\s*['"]\/?alloy\//;

// One or more trailing source map comments, in line or block form, with the
// legacy @ prefix too, followed by any whitespace. The URL part mirrors
// @babel/core's EXTERNAL_SOURCEMAP_REGEX, so a comment-like string at the end
// of a template literal or string (which would end in a quote) is not matched.
const SOURCE_MAP_URL = '[@#][ \\t]+sourceMappingURL=[^\\s\'"`]+[ \\t]*';
const SOURCE_MAP_COMMENT = new RegExp(
	'(?:\\/\\/' + SOURCE_MAP_URL + '|\\/\\*' + SOURCE_MAP_URL + '\\*\\/)'
	+ '(?:\\s*(?:\\/\\/' + SOURCE_MAP_URL + '|\\/\\*' + SOURCE_MAP_URL + '\\*\\/))*'
	+ '\\s*$'
);

/*
 * @method createVisitor
 * Builds the merged visitor used by both call sites.
 *
 * @param {Object} compileConfig Alloy's compile config, for the builtins visitor
 * @param {Object} alloyConfig The alloyConfig (platform/deploytype/target), for the optimizer
 * @return {Object} A @babel/traverse visitor
 */
exports.createVisitor = function(compileConfig, alloyConfig) {
	return traverse.visitors.merge([
		builtinsVisitor(compileConfig),
		optimizerVisitor(alloyConfig)
	]);
};

/*
 * @method createBuiltinsVisitor
 * The builtins visitor on its own. It only reads the AST -- it copies builtin
 * modules into Resources as a side effect -- so a file that needs this but not
 * the optimizer can be scanned without ever being printed or rewritten.
 */
exports.createBuiltinsVisitor = function(compileConfig) {
	return builtinsVisitor(compileConfig);
};

/*
 * @method needsOptimize
 * True if the optimizer visitor could change this code. Deliberately
 * over-inclusive: a define name inside a comment or string costs one needless
 * parse, which is what every file costs today.
 */
exports.needsOptimize = function(code) {
	return getOptimizeRx().test(code);
};

/*
 * @method hasAlloyRequire
 * True if the builtins visitor could find something to copy in this code.
 */
exports.hasAlloyRequire = function(code) {
	return ALLOY_REQUIRE_RX.test(code);
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
 * Removes trailing sourceMappingURL comments, line or block form, as
 * @babel/core did. The file is reprinted, so a map it points to would no
 * longer match.
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

/*
 * @method traverse
 * Applies a visitor without printing, for the scan-only case.
 */
exports.traverse = function(ast, visitor) {
	traverse(ast, visitor);
};
