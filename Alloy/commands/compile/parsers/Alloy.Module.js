exports.parse = function(node, state) {
	node.nodeName = 'View';
	return require('./default').parse(node, state);
};