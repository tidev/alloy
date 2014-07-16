exports.parse = function(node, state) {
	// AndroidView is simply an instance of Ti.UI.View
	node.nodeName = 'View';
	return require('./default').parse(node, state);
};