var CU = require('../compilerUtils');

exports.parse = function(node, state, parser) {
	var args = CU.getParserArgs(node, state),
		code = ''; 

	if (state.pre) { 
		code += state.pre(node, state, args) || ''; 
		delete state.pre;
	}
	var newState = parser(node, state, args);
	code += newState.code;
	if (state.post) { 
		code += state.post(node, newState, args) || ''; 
		delete state.post;
	}
	newState.code = code;

	return newState;
}