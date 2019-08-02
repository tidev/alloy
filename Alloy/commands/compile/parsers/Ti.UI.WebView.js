const styler = require('../styler');

exports.parse = function(node, state) {
	return require('./base').parse(node, state, parse);
};

function parse(node, state, args) {
	const linkHandler = node.getAttribute('onlink');
	if (linkHandler) {
		node.setAttribute('onlink', `${styler.STYLE_EXPR_PREFIX}${linkHandler}`);
	}
	return require('./default').parse(node, state, args);
}
