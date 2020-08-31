var path = require('path'),
	fs = require('fs'),
	_ = require('lodash'),
	CU = require('../compilerUtils'),
	U = require('../../../utils'),
	styler = require('../styler'),
	CONST = require('../../../common/constants'),
	moduleRoot = path.join(__dirname, '..', '..', '..', '..'),
	TYPES = ['view', 'widget'];

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

	switch (type) {
		case 'view':
			method = 'createController';
			if (platform) { paths.push(path.join(appPath, CONST.DIR.VIEW, platform, src)); }
			paths.push(path.join(appPath, CONST.DIR.VIEW, src));
			break;
		case 'widget':
			method = 'createWidget';
			extraArgs = "'" + name + "',";
			U.getWidgetDirectories(appPath).forEach(function(wDir) {
				if (wDir.manifest.id === src) {
					if (platform) {
						paths.push(path.join(wDir.dir, CONST.DIR.VIEW, platform, name));
					}
					paths.push(path.join(wDir.dir, CONST.DIR.VIEW, name));
				}
			});
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

	// process the children, if any
	var children = U.XML.getElementsFromNodes(node.childNodes),
		xChildren = [];
	_.each(children, function(child) {
		if (!CU.isNodeForCurrentPlatform(child)) { return; }
		var childArgs = CU.getParserArgs(child);
		code += CU.generateNodeExtended(child, state, {
			parent: {},
			post: function(node, state, args) {
				if (state.parent.symbol) {
					xChildren.push(state.parent.symbol);
				}
			}
		});
	});

	// add extra createArgs if present
	var xArgs = {};

	if (xChildren.length) { xArgs.children = '__ALLOY_EXPR__--[' + xChildren.join(',') + ']'; }
	if (state.model) { xArgs[CONST.BIND_MODEL_VAR] = '__ALLOY_EXPR__--' + state.model; }
	if (state.parent && state.parent.symbol) {
		xArgs[CONST.PARENT_SYMBOL_VAR] = '__ALLOY_EXPR__--' + state.parent.symbol;
	} else if (CU.currentDefaultId !== 'index') {
		xArgs[CONST.PARENT_SYMBOL_VAR] = '__ALLOY_EXPR__--' + CONST.PARENT_SYMBOL_VAR;
	}
	if (state.templateObject) {
		xArgs[CONST.ITEM_TEMPLATE_VAR] = '__ALLOY_EXPR__--' + state.templateObject;
	}
	args.createArgs = _.extend(args.createArgs || {}, xArgs);

	// Generate runtime code
	code += (state.local ? 'var ' : '') + args.symbol + ' = Alloy.' + method + "('" + src +
		"'," + extraArgs + styler.generateStyleParams(
		state.styles,
		args.classes,
		args.id,
		type === 'widget' ? 'Alloy.Widget' : 'Alloy.Require',
		args.createArgs,
		state
	) + ')';
	let parent = {
		symbol: args.symbol + '.getViewEx({recurse:true})'
	};
	if (args.parent.symbol && !state.templateObject && !state.androidMenu) {
		code += ';\n' + args.symbol + '.setParent(' + args.parent.symbol + ');\n';
	} else if (type === 'widget' && (node.parentNode && node.parentNode.nodeName === 'Alloy')) {
		code += '.getViewEx({recurse:true});\n';
		parent = { symbol: args.symbol };
	} else {
		code += ';\n';
	}

	return {
		parent: parent,
		controller: args.symbol,
		styles: state.styles,
		code: code
	};
}
