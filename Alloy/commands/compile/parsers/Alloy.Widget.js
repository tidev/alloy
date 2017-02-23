exports.parse = function(node, state) {

	if (!node.getAttribute('src') && state.widgetId) {
		node.setAttribute('src', state.widgetId);
	}

	node.nodeName = 'Require';
	node.setAttribute('type', 'widget');
	return require('./Alloy.Require').parse(node, state);
};
