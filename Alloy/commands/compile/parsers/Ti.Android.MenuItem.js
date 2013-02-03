var CU = require('../compilerUtils'),
	_ = require('../../../lib/alloy/underscore')._;

exports.parse = function(node, state) {
	return require('./base').parse(node, state, parse);
};

function parse(node, state, args) {
	var code = '';
	var styleObjectCode = CU.generateStyleParams(
		state.styles, 
		args.classes, 
		args.id, 
		CU.getNodeFullname(node), 
		_.defaults(state.extraStyle || {}, args.createArgs || {}) 
	);
	var styleObjectSymbol = CU.generateUniqueId(); 
	var initStyle = '_.pick(' + styleObjectSymbol + ',Alloy.Android.menuItemCreateArgs)';
	var postStyle = '_.omit(' + styleObjectSymbol + ',Alloy.Android.menuItemCreateArgs)';

	code += 'var ' + styleObjectSymbol + '=' + styleObjectCode + ';';
	code += args.symbol + '=' + state.parent.symbol + ".add(" + initStyle + ");";
	code += args.symbol + '.applyProperties(' + postStyle + ');';

	return {
		parent: {},
		styles: state.styles,
		code: code
	};
};