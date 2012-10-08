var pro = require("../../../uglify-js/uglify-js").uglify,
	_ = require('../../../lib/alloy/underscore')._;

exports.process = function(ast, config, report) {
	config = config ? config.alloyConfig : {};
	config.deploytype = config.deploytype || 'development';

	// create list of platform and deploy type defines
	var defines = {
		OS_IOS:          config.platform === 'ios',
		OS_ANDROID:      config.platform === 'android',
		OS_MOBILEWEB:    config.platform === 'mobileweb',
		ENV_DEV:         config.deploytype === 'development',
		ENV_DEVELOPMENT: config.deploytype === 'development',
		ENV_TEST:        config.deploytype === 'test',
		ENV_PROD:        config.deploytype === 'production',
		ENV_PRODUCTION:  config.deploytype === 'production'
	};
	_.each(defines, function(v,k) {
		defines[k] = [ 'num', v ? 1 : 0 ];
	});	

	var opts = {
		mangle: false,                    // Mangle any names?
		no_functions: true,               // Don't mangle functions?
		toplevel: false,                  // Mangle toplevel names?
		defines: defines,                 // A list of definitions to process
		except: ['Ti','Titanium','Alloy'] // A list of names to leave untouched
	};

	return pro.ast_mangle(ast, opts);
}