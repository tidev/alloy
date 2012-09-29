var CU = require('../compilerUtils'),
	_ = require('../../../lib/alloy/underscore')._;

// This is part of the Ti.Android.Menu.add() API docs
var ADD_ARGS = [
	 'itemId', 
	 'groupId', 
	 'title', 
	 'order'
];
var addArgsString = '[' + _.map(ADD_ARGS, function(a) { return "'" + a + "'"}).join(',') + ']';

exports.parse = function(node, state) {
	return require('./base').parse(node, state, parse);
};

function parse(node, state, args) {
	var code = '';
	var styleObjectCode = CU.generateStyleParams(
		state.styles, 
		args.classes, 
		args.id, 
		node.nodeName, 
		_.defaults(state.extraStyle || {}, args.createArgs || {}) 
	);
	var styleObjectSymbol = CU.generateUniqueId(); 
	var initStyle = '_.pick(' + styleObjectSymbol + ',' + addArgsString + ')';

	// TODO: http://jira.appcelerator.org/browse/ALOY-311
	//       http://jira.appcelerator.org/browse/ALOY-312
	//var postStyle = '_.omit(' + styleObjectSymbol + ',' + addArgsString + ')';

	code += 'var ' + styleObjectSymbol + '=' + styleObjectCode + ';';
	code += args.symbol + '=A$(' + state.parent.symbol + ".add(" + initStyle + "), '" + node.nodeName + "', " + (args.parent.symbol || 'null') + ");";
	
	// TODO: http://jira.appcelerator.org/browse/ALOY-313
	code += '_.each(' + styleObjectSymbol + ',function(v,k) { ' + args.symbol + '[k] = v; });';

	return {
		parent: {},
		styles: state.styles,
		code: code
	};
};