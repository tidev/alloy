var CU = require('../compilerUtils'),
	U = require('../../../utils'),
	CONST = require('../../../common/constants'),
	styler = require('../styler'),
	_ = require('../../../lib/alloy/underscore')._;

exports.parse = function(node, state) {
	return require('./base').parse(node, state, parse);
};

function parse(node, state, args) {
	var code = '',
		actionView,
		createArgs = args.createArgs || {};

	_.each(U.XML.getElementsFromNodes(node.childNodes), function(child) {
		// process children, of which only ActionView is supported
		var childArgs = CU.getParserArgs(child, state);
		var parts = CU.getNodeFullname(child).split('.');
		if (parts[0] === '_ProxyProperty') {
			actionView = require('./_ProxyProperty.' + parts[1]).parse(node, state);
		}
	});
	if(actionView) {
		// add the code to the parent
		code += actionView.code;
	}

	var styleObjectCode = styler.generateStyleParams(
		state.styles,
		args.classes,
		args.id,
		CU.getNodeFullname(node),
		_.defaults(state.extraStyle || {}, createArgs)
	);

	return {
		parent: {},
		styles: state.styles,
		code: code + U.evaluateTemplate('Ti.Android.MenuItem.js', {
			item: args.symbol,
			parent: state.parent.symbol || CONST.PARENT_SYMBOL_VAR,
			style: CU.generateUniqueId(),
			styleCode: styleObjectCode,
			actionView: (actionView && actionView.parent) ? actionView.parent.symbol : false
		})
	};
}