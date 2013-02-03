var path = require('path'),
	_ = require('../../../lib/alloy/underscore')._,
	CU = require('../compilerUtils'),
	U = require('../../../utils'),
	CONST = require('../../../common/constants'),
	moduleRoot = path.join(__dirname,'..','..','..','..'),
	TYPES = ['view','widget'];

exports.parse = function(node, state) {
	return require('./base').parse(node, state, parse);
};

function parse(node, state, args) {
	var code = '',
		type = node.getAttribute('type') || CONST.REQUIRE_TYPE_DEFAULT,
		src = node.getAttribute('src'),
		method;

	// validate src
	if (!src) {
		U.die('<Require> elements must have a "src" attribute.');
	} else if (U.XML.getElementsFromNodes(node.childNodes).length !== 0) {
		U.die('<Require> elements may not have child elements.');
	}

	// determine which Alloy method to use
	var extraArgs = '';
	var appPath = CU.getCompilerConfig().dir.home;
	var requirePath, alloyRequirePath;
	switch(type) {
		case 'view':
			method = 'createController';
			requirePath = path.join(appPath,CONST.DIR.VIEW,src);
			break;
		case 'widget':
			method = 'createWidget';
			extraArgs = "'widget',";
			requirePath = path.join(appPath,CONST.DIR.WIDGET,src,CONST.DIR.VIEW,CONST.NAME_WIDGET_DEFAULT);
			alloyRequirePath = path.join(moduleRoot,'widgets',src,CONST.DIR.VIEW,CONST.NAME_WIDGET_DEFAULT);
			break;
		default:
			U.die('Invalid <Require> type "' + type + '"');
	}

	// make sure the required file exists at compile time, rather than
	// waiting til runtime.
	if (!(new RegExp('\\.' + CONST.FILE_EXT.VIEW + '$')).test(requirePath)) {
		requirePath += '.' + CONST.FILE_EXT.VIEW;
	}
	if (!(new RegExp('\\.' + CONST.FILE_EXT.VIEW + '$')).test(alloyRequirePath)) {
		alloyRequirePath += '.' + CONST.FILE_EXT.VIEW;
	}

	if (!(path.existsSync(requirePath) || (type === 'widget' && path.existsSync(alloyRequirePath)))) {
		U.die(type + ' "' + src + '" at path "' + requirePath + '"' + (type === 'widget' ? ' or "' + alloyRequirePath + '"' : '')  + ' does not exist.');
	}

	// Remove <Require>-specific attributes from createArgs
	delete args.createArgs.type;
	delete args.createArgs.src;

	// make symbol a local variable if necessary, used for binding
	if (state.local) {
		args.symbol = CU.generateUniqueId();
	}

	// add model to createArgs if binding
	if (state.model) {
		var modelObj = {};
		modelObj[CONST.BIND_MODEL_VAR] = '__ALLOY_EXPR__--'+state.model;
		args.createArgs = _.extend(args.createArgs || {}, modelObj);
	}

	// Generate runtime code
	code += (state.local ? 'var ' : '') + args.symbol + " = Alloy." + method + "('" + src + "'," + extraArgs + CU.generateStyleParams(
		state.styles,
		args.classes,
		args.id,
		CU.getNodeFullname(node),
		args.createArgs,
		state
	) + ");\n";
	if (args.parent.symbol) {
		code += args.symbol + '.setParent(' + args.parent.symbol + ');\n';
	}

	return {
		parent: {
			node: node,
			symbol: args.symbol + '.getViewEx({recurse:true})'
		},
		styles: state.styles,
		code: code
	}
};