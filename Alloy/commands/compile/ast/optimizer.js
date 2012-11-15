var pro = require("../../../uglify-js/uglify-js").uglify;
var optimizer = require('../optimizer');

exports.process = function(ast, config, report) {
	config = config ? config.alloyConfig : {};
	config.deploytype = config.deploytype || 'development';

	// create list of platform defines
	var defines = {
		OS_IOS:          config.platform === 'ios',
		OS_ANDROID:      config.platform === 'android',
		OS_MOBILEWEB:    config.platform === 'mobileweb'
	};
	return optimizer.optimize(ast, defines);
}