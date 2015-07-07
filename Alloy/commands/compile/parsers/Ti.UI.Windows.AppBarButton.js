exports.parse = function(node, state) {
	return require('./base').parse(node, state, parse);
};

function parse(node, state, args) {
	var systemIcon = node.getAttribute('icon');
	if (systemIcon.indexOf('.SystemIcon.') === -1) {
		node.setAttribute('icon', 'Ti.UI.Windows.SystemIcon.' + systemIcon);
	}

	// Generate runtime code using default
	return require('./default').parse(node, state);
}
