var fs = require('fs'),
	path = require('path'),
	_ = require('../../lib/alloy/underscore')._
	CU = require('./compilerUtils'),
	logger = require('../../common/logger'),
	CONST = require('../../common/constants');

exports.styleOrderBase = 1;
exports.styleOrderCounter = exports.styleOrderBase;
exports.globalStyle = [];

/*
 * @method loadGlobalStyles
 * Loads all global styles (app.tss) in a project and sorts them appropriately. 
 * The order of sorting is as follows:
 *
 * 1. global
 * 2. global theme
 * 3. global platform-specific
 * 4. global theme platform-specific
 * 
 * This function does not return a result, but instead updates the global style
 * array that will be used as a base for all controller styling. This is 
 * executed before any other styling is performed during the compile phase.
 *
 * @param {appPath} Full path to the "app" folder of the target project
 * @param {theme} If defined, the name of theme in use by the project
 */
exports.loadGlobalStyles = function(appPath, platform, theme) {
	// reset the global style array
	exports.globalStyle = [];

	// validate/set arguments
	var apptss = CONST.GLOBAL_STYLE;
	var stylesDir = path.join(appPath,CONST.DIR.STYLE);
	if (theme) {
		var themesDir = path.join(appPath,'themes',theme,CONST.DIR.STYLE);
	}

	// create array of global styles to load based on arguments
	var loadArray = [];
	loadArray.push({ 
		path: path.join(stylesDir,apptss),
		msg: apptss
	});
	theme && loadArray.push({ 
		path: path.join(themesDir,apptss),
		msg: apptss + '(theme:' + theme + ')',
		obj: { theme: true }
	});
	loadArray.push({ 
		// TODO: get the real platforms object
		path: path.join(stylesDir,platform,apptss),
		msg: apptss + '(platform:' + platform + ')',
		obj: { platform: true }
	});
	theme && loadArray.push({ 
		// TODO: get the real platforms object
		path: path.join(themesDir,platform,apptss),
		msg: apptss + '(theme:' + theme + ' platform:' + platform + ')',
		obj: { platform: true, theme: true }
	});

	// load & merge each global style file to update the global style array 
	_.each(loadArray, function(g) {
		if (path.existsSync(g.path)) {
			logger.info('[' + g.msg + '] global style processing...');
			exports.globalStyle = CU.loadAndSortStyle(g.path, undefined, _.extend(
				{ existingStyle: exports.globalStyle }, 
				g.obj || {}
			));
		}
	});	

	exports.styleOrderBase = ++exports.styleOrderCounter;
}
