exports.parse = function(node, state) {
	node.nodeName = 'Require';
	node.setAttribute('type','widget');
	return require('./Alloy.Require').parse(node, state);
};