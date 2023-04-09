exports.parse = function(node, state) {
	_.extend(state, {
		proxyPropertyDefinition: {
			parents: [
				'Ti.UI.Android.CollapseToolbar',
				'Ti.UI.iPad.Popover'
			]
		}
	});
	return require('./Ti.UI.Android.CollapseToolbar._ProxyProperty').parse(node, state);
};
