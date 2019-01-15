const tiapp = require('../../../tiapp');
const MIN_VERSION = '8.0.0';

exports.parse = function(node, state) {
	const tiappSdkVersion = tiapp.getSdkVersion();
	if (tiapp.version.lt(tiappSdkVersion, MIN_VERSION)) {
		const platform = CU.getCompilerConfig().alloyConfig.platform;
		if (platform !== 'ios') {
			U.die(`Ti.UI.NavigationWindow for ${platform} requires Titanium ${MIN_VERSION}+`);
		}
		node.setAttribute('ns', 'Ti.UI.iOS');
	}
	return require('./Ti.UI.ButtonBar').parse(node, state);
};
