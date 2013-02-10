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
	code += "__styleParams = " + CU.generateStyleParams(
		state.styles,
		args.classes,
		args.id,
		CU.getNodeFullname(node),
		_.defaults(state.extraStyle || {}, args.createArgs || {}),
		state
	) + ';\n';
	if (!state.local) {
		code += "if (refresh) {\n" + args.symbol + ".applyProperties(__styleParams);\n} else {\n";
	}		
	code += (state.local ? 'var ' : '') + args.symbol + " = " + args.ns + "." + createFunc + "(__styleParams\n";	
	code += ");\n";
	if (args.parent.symbol) {
		code += args.parent.symbol + ".add(" + args.symbol + ");\n";
	}
	if (!state.local) {
		code += "}\n";
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

		var pre =  "var children = " + args.symbol + ".children;" +
				   "for (var d = children.length-1; d >= 0; d--) {" + 
				   "	" + args.symbol + ".remove(children[d]);" +
				   "}";

		code += _.template(CU.generateCollectionBindingTemplate(args), {
			localModel: localModel,
			pre: pre,
			items: itemCode,
			post: ''
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