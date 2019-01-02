exports.parse = function(node, state) {
	// default handling for View-based modules except ti.map
	if (node.getAttribute('module') !== 'ti.map' && node.getAttribute('ns') !== 'Alloy.Globals.Map') {
		node.nodeName = 'View';
		return require('./default').parse(node, state);
	} else {
		// handle map views specially
		node.nodeName = 'View';
		return require('./Ti.Map.View').parse(node, state);
	}
};