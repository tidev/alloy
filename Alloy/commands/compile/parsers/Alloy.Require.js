var path = require('path'),
	fs = require('fs'),
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
		name = node.getAttribute('name') || CONST.NAME_WIDGET_DEFAULT,
		method;

	// validate src
	if (!src) {
		U.die('<Require> elements must have a "src" attribute.');
	} else if (U.XML.getElementsFromNodes(node.childNodes).length !== 0) {
		U.die('<Require> elements may not have child elements.');
	}

	// determine which Alloy method to use
	var extraArgs = '';
	var config = CU.getCompilerConfig();
	var appPath = config.dir.home;
	var paths = [];

	var platform;
	if (config && config.alloyConfig && config.alloyConfig.platform) {
		platform = config.alloyConfig.platform;
	}

	switch(type) {
		case 'view':
			method = 'createController';
			platform && paths.push(path.join(appPath,CONST.DIR.VIEW,platform,src));
			paths.push(path.join(appPath,CONST.DIR.VIEW,src));
			break;
		case 'widget':
			method = 'createWidget';
			extraArgs = "'" + name + "',";
			platform && paths.push(path.join(appPath,CONST.DIR.WIDGET,src,CONST.DIR.VIEW,platform,name));
			paths.push(path.join(appPath,CONST.DIR.WIDGET,src,CONST.DIR.VIEW,name));
			platform && paths.push(path.join(moduleRoot,'widgets',src,CONST.DIR.VIEW,platform,name));
			paths.push(path.join(moduleRoot,'widgets',src,CONST.DIR.VIEW,name));
			break;
		default:
			U.die('Invalid <Require> type "' + type + '"');
	}

	// check the extensions on the paths to check
	var regex = new RegExp('\\.' + CONST.FILE_EXT.VIEW + '$');
	var found = false;
	for (var i = 0; i < paths.length; i++) {
		var fullpath = paths[i];
		fullpath += regex.test(fullpath) ? '' :  '.' + CONST.FILE_EXT.VIEW;
		if (fs.existsSync(fullpath)) {
			found = true;
			break;
		}
	}

	// abort if there's no view to be found
	if (!found) {
		U.die([
			type + ' "' + src + '" ' + (type === 'widget' ? 'view "' + name + '" ' : '') + 
				'does not exist.',
			'The following paths were inspected:'
		].concat(paths));
	}

	// Remove <Require>-specific attributes from createArgs
	delete args.createArgs.type;
	delete args.createArgs.src;
	delete args.createArgs.name;

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

	if (state.parent && state.parent.symbol) {
		var parentObj = {};
		parentObj[CONST.PARENT_SYMBOL_VAR] = '__ALLOY_EXPR__--'+state.parent.symbol;
		args.createArgs = _.extend(args.createArgs || {}, parentObj);
	}	

	// Generate runtime code
	code += (state.local ? 'var ' : '') + args.symbol + " = Alloy." + method + "('" + src + "'," + extraArgs + CU.generateStyleParams(
		state.styles,
		args.classes,
		args.id,
		type === 'widget' ? 'Alloy.Widget' : 'Alloy.Require',
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