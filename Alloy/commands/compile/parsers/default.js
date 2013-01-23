var CU = require('../compilerUtils'),
	U = require('../../../utils'),
	CONST = require('../../../common/constants'),
	_ = require('../../../lib/alloy/underscore')._;

exports.parse = function(node, state) {
	return require('./base').parse(node, state, parse);
};

function parse(node, state, args) {
	var createFunc = 'create' + node.nodeName,
		isCollectionBound = args[CONST.BIND_COLLECTION] ? true : false,
		code = '';

	// make symbol a local variable if necessary
	if (state.local) {
		args.symbol = CU.generateUniqueId();
	}

	// Generate runtime code
	code += (state.local ? 'var ' : '') + args.symbol + " = " + args.ns + "." + createFunc + "(\n";
	code += CU.generateStyleParams(
		state.styles,
		args.classes,
		args.id,
		node.nodeName,
		_.defaults(state.extraStyle || {}, args.createArgs || {}),
		state
	) + '\n';
	code += ");\n";
	if (args.parent.symbol) {
		code += args.parent.symbol + ".add(" + args.symbol + ");\n";
	}

	if (isCollectionBound) {
		var localModel = CU.generateUniqueId();
		var itemCode = '';

		_.each(U.XML.getElementsFromNodes(node.childNodes), function(child) {
			itemCode += CU.generateNodeExtended(child, state, {
				parent: {
					node: node,
					symbol: args.symbol
				},
				local: true,
				model: localModel
			});
		});

		code += _.template(getBindingCode(args), {
			localModel: localModel,
			itemCode: itemCode,
			parentSymbol: args.symbol
		});
	}

	// Update the parsing state
	return {
		parent: isCollectionBound ? {} : {
			node: node,
			symbol: args.symbol
		},
		local: state.local || false,
		model: state.model || undefined,
		condition: state.condition || undefined,
		styles: state.styles,
		code: code
	}
};

function getBindingCode(args) {
	var code = '';

	// Do we use an instance or singleton collection reference?
	var col;
	if (args[CONST.BIND_COLLECTION].indexOf('$.') === 0) {
		col = args[CONST.BIND_COLLECTION];
	} else {
		col = 'Alloy.Collections[\'' + args[CONST.BIND_COLLECTION] + '\']';
	}

	var where = args[CONST.BIND_WHERE];
	var transform = args[CONST.BIND_TRANSFORM];
	var whereCode = where ? where + "(" + col + ")" : col + ".models";
	var transformCode = transform ? transform + "(<%= localModel %>)" : "{}";
	var handlerVar = CU.generateUniqueId();

	code += "var " + handlerVar + "=function(e) {";
	code += "	var models = " + whereCode + ";";
	code += "	var children = <%= parentSymbol %>.children;";
	code += "	for (var d = children.length-1; d >= 0; d--) {";
	code += "		<%= parentSymbol %>.remove(children[d]);";
	code += "	}";
	code += "	len = models.length;";
	code += "	for (var i = 0; i < len; i++) {";
	code += "		var <%= localModel %> = models[i];";
	code += "		<%= localModel %>.__transform = " + transformCode + ";";
	code += "		<%= itemCode %>";
	code += "	}";
	code += "};";
	code += col + ".on('" + CONST.COLLECTION_BINDING_EVENTS + "'," + handlerVar + ");";

	CU.destroyCode += col + ".off('" + CONST.COLLECTION_BINDING_EVENTS + "'," + handlerVar + ");";

	return code;
}