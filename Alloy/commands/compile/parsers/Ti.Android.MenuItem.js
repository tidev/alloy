var CU = require('../compilerUtils'),
	U = require('../../../utils'),
	CONST = require('../../../common/constants'),
	styler = require('../styler'),
	_ = require('../../../lib/alloy/underscore')._;

exports.parse = function(node, state) {
	return require('./base').parse(node, state, parse);
};

function parse(node, state, args) {
	var code = '';
	var styleObjectCode = styler.generateStyleParams(
		state.styles,
		args.classes,
		args.id,
		CU.getNodeFullname(node),
		_.defaults(state.extraStyle || {}, args.createArgs || {})
	);

	return {
		parent: {},
		styles: state.styles,
		code: U.evaluateTemplate('Ti.Android.MenuItem.js', {
			item: args.symbol,
			parent: state.parent.symbol || CONST.PARENT_SYMBOL_VAR,
			style: CU.generateUniqueId(),
			styleCode: styleObjectCode
		})
	};
}