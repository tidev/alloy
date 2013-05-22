var fs = require('fs'),
	path = require('path'),
	_ = require('../../lib/alloy/underscore')._
	U = require('../../utils'),
	CU = require('./compilerUtils'),
	logger = require('../../common/logger'),
	CONST = require('../../common/constants');

// constants
var STYLE_REGEX = /^\s*([\#\.]{0,1})([^\[]+)(?:\[([^\]]+)\])*\s*$/;
var VALUES = {
	ID:     100000,
	CLASS:   10000,
	API:      1000,
	PLATFORM:  100,
	FORMFACTOR: 10,
	SUM:         1,
	THEME:       0.9,
	ORDER:       0.0001
};

// private variables
var styleOrderCounter = 1;

/**
 * @property {Array} globalStyle
 * The global style array, which contains an merged, ordered list of all 
 * applicable global styles. This will serve as the base for all controller-
 * specific styles.
 *
 */
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
 * @param {String} Full path to the "app" folder of the target project
 * @param {String} The mobile platform for which to load styles
 * @param {Object} [opts] Additional options
 */
exports.loadGlobalStyles = function(appPath, platform, opts) {
	// reset the global style array
	exports.globalStyle = [];

	// validate/set arguments
	opts || (opts = {});
	var theme = opts.theme;
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
		path: path.join(stylesDir,platform,apptss),
		msg: apptss + '(platform:' + platform + ')',
		obj: { platform: true }
	});
	theme && loadArray.push({ 
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

	styleOrderCounter++;
}

/*
 * @method sortStyles
 * Given a parsed style from loadStyle(), sort all the style entries into an 
 * ordered array. This is the final operations to prepare a style for usage with 
 * a Titanium UI component in Alloy.
 *
 * @param {Object} Parsed style object from a loadStyle() call
 * @param {Object} [opts] Options for this function
 */
exports.sortStyles = function(style, opts) {
	var sortedStyles = [];
	opts || (opts = {});

	if (_.isObject(style) && !_.isEmpty(style)) {
		for (var key in style) {
			var obj = {};
			var priority = styleOrderCounter++ * VALUES.ORDER;
			var match = key.match(STYLE_REGEX);
			if (match === null) {
				U.die('Invalid style specifier "' + key + '"');
			}
			var newKey = match[2];
			switch(match[1]) {
				case '#':
					obj.isId = true;
					priority += VALUES.ID;
					break;
				case '.':
					obj.isClass = true;
					priority += VALUES.CLASS;
					break;
				default:
					if (match[2]) {
						obj.isApi = true;
						priority += VALUES.API;
					}
					break;
			}

			if (match[3]) {
				obj.queries = {};
				_.each(match[3].split(/\s+/), function(query) {
					var parts = query.split('=');
					var q = U.trim(parts[0]);
					var v = U.trim(parts[1]);
					if (q === 'platform') {
						priority += VALUES.PLATFORM + VALUES.SUM;
						v = v.split(',');
					} else if (q === 'formFactor') {
						priority += VALUES.FORMFACTOR + VALUES.SUM;
					} else {
						priority += VALUES.SUM;
					}
					obj.queries[q] = v;
				});
			} 

			_.extend(obj, {
				priority: priority + (opts.platform ? VALUES.PLATFORM : 0) + (opts.theme ? VALUES.THEME : 0),
				key: newKey, 
				style: style[key]
			});
			sortedStyles.push(obj);
		}
	}

	var theArray = opts.existingStyle ? opts.existingStyle.concat(sortedStyles) : sortedStyles;
	return _.sortBy(theArray, 'priority');
}

