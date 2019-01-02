var U = require('../../../utils');

exports.parse = function(node, state) {
	var height = state.parent.node.getAttribute('height') || null;
	var width = state.parent.node.getAttribute('width') || null;
	if (height || width) {
		// apply height/width attributes set on <Popover> to the <ContentView> within
		var contentwin = U.XML.getElementsFromNodes(node.childNodes)[0];
		if (height && !contentwin.hasAttribute('height')) {contentwin.setAttribute('height', height);}
		if (width && !contentwin.hasAttribute('width')) {contentwin.setAttribute('width', width);}
	}
	return require('./Ti.UI.iPad.Popover._ProxyProperty').parse(node, state);
};
