var CU = require('../compilerUtils'),
	U = require('../../../utils'),
	CONST = require('../../../common/constants'),
	_ = require('../../../lib/alloy/underscore')._;

exports.parse = function(node, state) {
	return require('./base').parse(node, state, parse);
};

function parse(node, state, args) {
	var code = '';

	// make symbol a local variable if necessary
	if (state.local) {
		args.symbol = CU.generateUniqueId();
	}

	// apply usual style properties
	var argsObject = {
		properties: CU.generateStyleParams(
			state.styles,
			args.classes,
			args.id,
			CU.getNodeFullname(node),
			_.defaults(state.extraStyle || {}, args.createArgs || {}),
			state
		)
	};

	// add in any events on the ItemTemplate
	if (args.events && args.events.length > 0) {
		argsObject.events = '{' + _.reduce(args.events, function(memo,o) {
			return memo + o.name + ':' + o.value + ',';
		}, '') + '}';
	}

	// process children and add them to childTemplates
	var children = U.XML.getElementsFromNodes(node.childNodes);
	var childTemplates;
	if (children.length > 0) {
		childTemplates = CU.generateUniqueId();
		code += 'var ' + childTemplates + '=[];'; 

		_.each(children, function(child) {
			code += CU.generateNodeExtended(child, state, {
				parent: {},
				local: true,
				isViewTemplate: true,
				post: function(node, state, args) {
					return childTemplates + '.push(' + state.item.symbol + ');';
				}
			});
		});

		argsObject.childTemplates = childTemplates;
	}

	// Generate runtime code
	code += (state.local ? 'var ' : '') + args.symbol + " = {"
	code += _.reduce(argsObject, function(memo,v,k) {
		return memo + k + ':' + v + ',';
	}, '');
	code += '};';

	// Update the parsing state
	return {
		parent: {},
		item: {
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