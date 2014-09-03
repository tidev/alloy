exports.parse = function(node, state) {
	return require('./base').parse(node, state, parse);
};

function parse(node, state, args) {
	// Get image property from the
	if (node.hasAttribute('image')) {
		var attr = node.getAttribute('image');
		node.setAttribute('image', attr.trim());
	}
	// Generate runtime code using default
	return require('./default').parse(node, state);
}
