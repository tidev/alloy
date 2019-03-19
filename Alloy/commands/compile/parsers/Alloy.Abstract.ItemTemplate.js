var CU = require('../compilerUtils'),
	U = require('../../../utils'),
	styler = require('../styler'),
	CONST = require('../../../common/constants'),
	_ = require('lodash');

var NAME_ERROR = 'Alloy.Abstract.ItemTemplate must have a "name" attribute';

exports.parse = function(node, state) {
	return require('./base').parse(node, state, parse);
};

function parse(node, state, args) {
	var code = '';

	// make sure we have a name
	var name = node.getAttribute('name');
	if (!name) {
		U.dieWithNode(node, NAME_ERROR);
	}
	node.removeAttribute('name');

	// make symbol a local variable if necessary
	if (state.local) {
		args.symbol = CU.generateUniqueId();
	}

	// apply usual style properties
	var argsObject = {
		properties: styler.generateStyleParams(
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
		argsObject.events = '{' + _.reduce(args.events, function(memo, o) {
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
			if (child.nodeName === 'Require') {
				U.dieWithNode(child, [
					'<ItemTemplate> cannot contain <Require> elements.',
					'ListView currently only supports Titanium API elements and Widgets:',
					'  examples: <Label>, <Button>, <ImageView>, etc...',
					'Please reference the ListView guide at docs.appcelerator.com for more details.'
				]);
			}

			// lets be naughty and pretend this is not a Widget
			// to generate a valid template
			if (child.nodeName === 'Widget') {
				let src = child.getAttribute('src'),
					ns = src.split('.'),
					name = ns.pop();

				child.removeAttribute('src');
				child.setAttribute('ns', ns.join('.'));
				child.nodeName = name;
			}

			code += CU.generateNodeExtended(child, state, {
				parent: {},
				local: true,
				isViewTemplate: true,
				post: function(node, state, args) {
					let symbol = (state.item && state.item.symbol) || args.symbol;
					return childTemplates + '.push(' + symbol + ');';
				}
			});
		});

		argsObject.childTemplates = childTemplates;
	}

	// Generate runtime code
	code += (state.local ? 'var ' : '') + args.symbol + ' = {';
	code += _.reduce(argsObject, function(memo, v, k) {
		return memo + k + ':' + v + ',';
	}, '');
	code += '};';

	code += (state.templateObject || CONST.ITEM_TEMPLATE_VAR);
	code +=	'["' + name + '"]=' + args.symbol + ';';

	// Update the parsing state
	return {
		parent: {},
		local: state.local || false,
		model: state.model || undefined,
		condition: state.condition || undefined,
		styles: state.styles,
		code: code
	};
}
