var CU = require('../compilerUtils'),
	U = require('../../../utils'),
	styler = require('../styler'),
	CONST = require('../../../common/constants'),
	_ = require('lodash'),
	tiapp = require('../../../tiapp'),
	platform = CU.getCompilerConfig().alloyConfig.platform;

exports.parse = function(node, state) {
	return require('./base').parse(node, state, parse);
};

function parse(node, state, args) {
	var fullname = CU.getNodeFullname(node),
		parts = fullname.split('.'),
		extras = [];

	if (node.previewContext) {
		extras.push(['previewContext', node.previewContext]);
	}

	if (CU[CONST.DOCROOT_MODULE_PROPERTY] && !node.hasAttribute('module')) {
		node.setAttribute('module', CU[CONST.DOCROOT_MODULE_PROPERTY]);
	}
	// is this just a proxy property?
	if (parts[0] === '_ProxyProperty') {
		return require('./_ProxyProperty.' + parts[1]).parse(node, state);
	}

	// special handling for touchEnabled per ALOY-911
	if (node.hasAttribute('touchEnabled')) {
		var attr = node.getAttribute('touchEnabled');
		extras.push(['touchEnabled', attr === 'true']);
	}

	if (extras.length) {
		state.extraStyle = state.extraStyle || {};
		state.extraStyle = _.extend(state.extraStyle, styler.createVariableStyle(extras));
	}

	// start assembling a basic view creation
	var createFunc = 'create' + node.nodeName,
		isCollectionBound = args[CONST.BIND_COLLECTION] ? true : false,
		code = '';
	if (node.nodeName === 'Annotation' && ( (platform == 'ios' && tiapp.version.gte('3.2.0')) || platform == 'android' && tiapp.version.gte('3.1.0'))) {
		// ALOY-800: on iOS & Android, using the external ti.map module, set the
		// namespace so that the ti.map module's createAnnotation() method is used
		args.ns = 'require("ti.map")';
	}

	// make symbol a local variable if necessary
	if (state.local) {
		args.symbol = CU.generateUniqueId();
	}

	// Generate runtime code
	if (state.isViewTemplate) {
		var bindId = node.getAttribute('bindId');
		code += (state.local ? 'var ' : '') + args.symbol + '={';
		code += "type:'" + fullname + "',";
		if (bindId) {
			code += "bindId:'" + bindId + "',";
		}

		// apply usual style properties
		var argsObject = {
			properties: styler.generateStyleParams(
				state.styles,
				args.classes,
				args.id,
				fullname,
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

		var children = U.XML.getElementsFromNodes(node.childNodes);
		var childTemplates;
		if (children.length > 0) {
			childTemplates = CU.generateUniqueId();

			code += 'childTemplates: (function() {';
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

			code += 'return ' + childTemplates + ';';
			code += '})(),';
		}

		// add the additional arguments to the code
		code += _.reduce(argsObject, function(memo, v, k) {
			return memo + k + ':' + v + ',';
		}, '');

		code += '};';
	} else {
		var module = node.getAttribute('module');
		if (module) {
			createFunc = node.getAttribute('method') || createFunc;
			code += (state.local ? 'var ' : '') + args.symbol + ' = ' + '(require("' + module + '").' + createFunc + ' || ' + args.ns + '.' + createFunc + ')(\n';
			code += styler.generateStyleParams(
				state.styles,
				args.classes,
				args.id,
				fullname,
				_.defaults(state.extraStyle || {}, args.createArgs || {}),
				state
			) + '\n';
			code += ');\n';


			delete args.createArgs['module'];
			delete args.createArgs['method'];
		} else {
			code += (state.local ? 'var ' : '') + args.symbol + ' = ' + args.ns + '.' + createFunc + '(\n';
			code += styler.generateStyleParams(
				state.styles,
				args.classes,
				args.id,
				fullname,
				_.defaults(state.extraStyle || {}, args.createArgs || {}),
				state
			) + '\n';
			code += ');\n';
		}

		if (args.parent.symbol) {
			code += args.parent.symbol + '.add(' + args.symbol + ');\n';
		}

		if (isCollectionBound && CU.isNodeForCurrentPlatform(node)) {
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

			var pre = 'var children = ' + args.symbol + '.children;' +
				'for (var d = children.length-1; d >= 0; d--) {' +
				'	' + args.symbol + '.remove(children[d]);' +
				'}';

			if (state.parentFormFactor || node.hasAttribute('formFactor')) {
				// if this node or a parent has set the formFactor attribute
				// we need to pass it to the data binding generator
				args.parentFormFactor = (state.parentFormFactor || node.getAttribute('formFactor'));
			}
			code += _.template(CU.generateCollectionBindingTemplate(args))({
				localModel: localModel,
				pre: pre,
				items: itemCode,
				post: ''
			});
		}
	}

	// Update the parsing state
	var ret = {
		isViewTemplate: state.isViewTemplate || false,
		local: state.local || false,
		model: state.model || undefined,
		condition: state.condition || undefined,
		styles: state.styles,
		code: code
	};
	var nextObj = {
		node: node,
		symbol: args.symbol
	};

	if (state.isViewTemplate) {
		return _.extend(ret, { item: nextObj });
	} else {
		return _.extend(ret, { parent: isCollectionBound ? {} : nextObj });
	}
}
