exports.parse = function(node, state) {
	return require('./base').parse(node, state, parse);
};

function parse(node, state, args) {

	if ( node.hasAttribute('src') ) {
		node.setAttribute('image', node.getAttribute('src').trim());
		node.removeAttribute('src');
	} else if (node.hasAttribute('image')) {
		node.setAttribute('image', node.getAttribute('image').trim());
	}
	
	// Generate runtime code using default
	return require('./default').parse(node, state);
}
