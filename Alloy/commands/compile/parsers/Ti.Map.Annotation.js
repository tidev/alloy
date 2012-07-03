var CU = require('../compilerUtils');

exports.parse = function(node, state) {
	var args = CU.getParserArgs(node, state),
		code = '';

	code += require('./default').parse(node, CU.createEmptyState(state.styles)).code;
	if (state.arrayName) {
		code += state.arrayName + '.push(' + args.symbol + ');\n';
	}
	return { code: code };
};