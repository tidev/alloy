exports.parse = function(node, state) {
	return require('./base').parse(node, state, parse);
};

function parse(node, state, args) {
	var actionStyle = node.getAttribute('style');
	if (actionStyle && actionStyle.indexOf('.UI.iOS.') === -1) {
		node.setAttribute('style', 'Ti.UI.iOS.PREVIEW_ACTION_STYLE_' + actionStyle.toUpperCase());
	}

	return require('./default').parse(node, state);
}
