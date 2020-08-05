var fs = require('fs'),
	path = require('path'),
	_ = require('lodash'),
	U = require('../../utils'),
	CU = require('./compilerUtils'),
	optimizer = require('./optimizer'),
	grammar = require('../../grammar/tss'),
	logger = require('../../logger'),
	BuildLog = require('./BuildLog'),
	CONST = require('../../common/constants'),
	deepExtend = require('node.extend');

// constants
var GLOBAL_STYLE_CACHE = 'global_style_cache.json';
var STYLE_ALLOY_TYPE = '__ALLOY_TYPE__';
var STYLE_EXPR_PREFIX = exports.STYLE_EXPR_PREFIX = '__ALLOY_EXPR__--';
var STYLE_REGEX = /^\s*([\#\.]{0,1})([^\[]+)(?:\[([^\]]+)\])*\s*$/;
var EXPR_REGEX = new RegExp('^' + STYLE_EXPR_PREFIX + '(.+)');
var BINDING_SPLIT_REGEX = /(\{[^:}]+\}(?!\}))/;
var BINDING_REFERENCE_REGEX = /^\{([^:}]+)\}$/;
var VALUES = {
	ID:     100000,
	CLASS:   10000,
	API:      1000,
	TSSIF:     500,
	PLATFORM:  100,
	FORMFACTOR: 10,
	SUM:         1,
	THEME:       0.9,
	ORDER:       0.0001
};
var DATEFIELDS = [
	'minDate', 'value', 'maxDate'
];
var KEYBOARD_TYPES = [
	'DEFAULT', 'ASCII', 'NUMBERS_PUNCTUATION', 'URL', 'EMAIL', 'DECIMAL_PAD', 'NAMEPHONE_PAD',
	'NUMBER_PAD', 'PHONE_PAD'
];
var RETURN_KEY_TYPES = [
	'DEFAULT', 'DONE', 'EMERGENCY_CALL', 'GO', 'GOOGLE', 'JOIN', 'NEXT', 'ROUTE',
	'SEARCH', 'SEND', 'YAHOO'
];
var AUTOCAPITALIZATION_TYPES = [
	'ALL', 'NONE', 'SENTENCES', 'WORDS'
];
var KEYBOARD_PROPERTIES = ['keyboardType', 'returnKeyType', 'autocapitalization'];

// private variables
var styleOrderCounter = 1;
var platform;

exports.setPlatform = function(p) {
	platform = p;
};

/*
 * @property {Array} globalStyle
 * The global style array, which contains an merged, ordered list of all
 * applicable global styles. This will serve as the base for all controller-
 * specific styles.
 *
 */
exports.globalStyle = [];

/*
 * @property {Object} bindingsMap
 * Holds the collection of models/collections data-bound to UI component
 * properties in the Alloy app. This map is used to create the most effecient
 * set of event listeners possible for dynamically updating the UI based on
 * changes to the data model/collections.
 *
 */
exports.bindingsMap = {};

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
 * This function updates the global style array that will be used as a base for
 * all controller styling. This is executed before any other styling is
 * performed during the compile phase. If the style is loaded from the cache,
 * it returns true, otherwise it returns false.
 *
 * @param {String} Full path to the "app" folder of the target project
 * @param {String} The mobile platform for which to load styles
 * @param {Object} [opts] Additional options
 *
 * @returns {Boolean} true if cache was used, false if not
 */
exports.loadGlobalStyles = function(appPath, opts) {
	// reset the global style array
	exports.globalStyle = [];

	// validate/set arguments
	opts = opts || {};
	var ret = false;
	var theme = opts.theme;
	var apptss = CONST.GLOBAL_STYLE;
	var stylesDir = path.join(appPath, CONST.DIR.STYLE);
	var themesDir;
	if (theme) {
		themesDir = path.join(appPath, 'themes', theme, CONST.DIR.STYLE);
	}
	var buildlog = BuildLog();
	var cacheFile = path.join(appPath, '..', CONST.DIR.BUILD, GLOBAL_STYLE_CACHE);

	// create array of global styles to load based on arguments
	var loadArray = [];
	loadArray.push({
		path: path.join(stylesDir, apptss),
		msg: apptss
	});
	if (theme) {
		loadArray.push({
			path: path.join(themesDir, apptss),
			msg: apptss + '(theme:' + theme + ')',
			obj: { theme: true }
		});
	}
	loadArray.push({
		path: path.join(stylesDir, platform, apptss),
		msg: apptss + '(platform:' + platform + ')',
		obj: { platform: true }
	});
	if (theme) {
		loadArray.push({
			path: path.join(themesDir, platform, apptss),
			msg: apptss + '(theme:' + theme + ' platform:' + platform + ')',
			obj: { platform: true, theme: true }
		});
	}

	// get rid of entries that don't exist
	var len = loadArray.length;
	for (var i = len - 1; i >= 0; i--) {
		if (!path.existsSync(loadArray[i].path)) {
			loadArray.splice(i, 1);
		}
	}

	// create hash of existing global styles
	var hash = U.createHash(_.map(loadArray, 'path'));

	// see if we can use the cached global style
	if (buildlog.data.globalStyleCacheHash === hash && fs.existsSync(cacheFile)) {
		// load global style object from cache
		logger.info('[global style] loading from cache...');
		exports.globalStyle = JSON.parse(fs.readFileSync(cacheFile, 'utf8'));
		ret = true;

		// increment the style order counter with the number of rules in the global style
		styleOrderCounter += exports.globalStyle.length;
	} else {
		// add new hash to the buildlog
		buildlog.data.globalStyleCacheHash = hash;

		// create the new global style object
		_.each(loadArray, function(g) {
			if (path.existsSync(g.path)) {
				logger.info('[' + g.msg + '] global style processing...');
				exports.globalStyle = exports.loadAndSortStyle(g.path, _.extend(
					{ existingStyle: exports.globalStyle },
					g.obj || {}
				));
			}
		});

		// write global style object to cache
		logger.info('[global style] writing to cache...');
		fs.writeFileSync(cacheFile, JSON.stringify(exports.globalStyle));

		// simply increment the style order counter
		styleOrderCounter++;
	}

	return ret;
};

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
	opts = opts || {};

	if (_.isObject(style) && !_.isEmpty(style)) {
		for (var key in style) {
			var obj = {};
			var priority = styleOrderCounter++ * VALUES.ORDER;
			var match = key.match(STYLE_REGEX);
			if (match === null) {
				U.die('Invalid style specifier "' + key + '"');
			}
			var newKey = match[2];

			// skip any invalid style entries
			if (newKey === 'undefined' && !match[1]) { continue; }

			// get the style key type
			switch (match[1]) {
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
				_.each(match[3].replace(/\s*,\s*/g, ',').split(/\s+/), function(query) {
					var parts = query.split('=');
					var q = U.trim(parts[0]);
					var v = U.trim(parts[1]);
					if (q === 'platform') {
						priority += VALUES.PLATFORM + VALUES.SUM;
						v = v.split(',');
					} else if (q === 'formFactor') {
						priority += VALUES.FORMFACTOR + VALUES.SUM;
					} else if (q === 'if') {
						priority += VALUES.TSSIF + VALUES.SUM;
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
};

exports.loadStyle = function(tssFile) {
	if (path.existsSync(tssFile)) {
		// read the style file
		var contents;
		var originalContents;
		var addedBraces;
		try {
			contents = fs.readFileSync(tssFile, 'utf8');
			// Store the originalContents in case we hit a parse error,
			// this allows us to show the correct contents of the .tss file
			originalContents = contents;
		} catch (e) {
			U.die('Failed to read style file "' + tssFile + '"', e);
		}

		// skip if the file is empty
		if (/^\s*$/gi.test(contents)) {
			return {};
		}

		// Add enclosing curly braces, if necessary
		if (!/^\s*\{[\s\S]+\}\s*$/gi.test(contents)) {
			contents = '{\n' + contents + '\n}';
			addedBraces = true;
		}
		// [ALOY-793] double-escape '\' in tss
		contents = contents.replace(/(\s)(\\+)(\s)/g, '$1$2$2$3');

		// Process tss file then convert to JSON
		var json;
		try {
			json = grammar.parse(contents);
			optimizer.optimizeStyle(json);
		} catch (e) {
			// If we added braces to the contents then the actual line number
			// on the original contents is one less than the error reports
			if (addedBraces) {
				e.line--;
			}
			U.dieWithCodeFrame(
				'Error processing style "' + tssFile + '"',
				{ line: e.line, column: e.column },
				originalContents,
				/Expected bare word\, comment\, end of line\, string or whitespace but ".+?" found\./.test(e.message)
					? 'Do you have an extra comma in your style definition?'
					: ''
			);
		}
		return json;
	}
	return {};
};

exports.loadAndSortStyle = function(tssFile, opts) {
	return exports.sortStyles(exports.loadStyle(tssFile), opts);
};

exports.createVariableStyle = function(keyValuePairs, value) {
	var style = {};

	if (!_.isArray(keyValuePairs)) {
		keyValuePairs = [[keyValuePairs, value]];
	}
	_.each(keyValuePairs, function(pair) {
		var k = pair[0];
		var v = pair[1];
		style[k] = { value:v };
		style[k][STYLE_ALLOY_TYPE] = 'var';
	});
	return style;
};

exports.processStyle = function(_style, _state) {
	var theState = _state || {};
	var regex = EXPR_REGEX;
	var code = '';

	function processStyle(style, opts) {
		opts = opts || {};
		style = opts.fromArray ? {0:style} : style;
		var groups = {}, sn, value;

		// need to add "properties" and bindIds for ListItems
		if (theState && theState.isListItem && opts.firstOrder && !opts.fromArray) {
			for (sn in style) {
				value = style[sn];
				var prefixes = sn.split(':');
				if (prefixes.length > 1) {
					var bindId = prefixes[0];
					groups[bindId] = groups[bindId] || {};
					groups[bindId][prefixes.slice(1).join(':')] = value;
				} else {
					// allow template to be specified
					if (sn === 'template') {
						groups.template = value;
					} else {
						groups.properties = groups.properties || {};
						groups.properties[sn] = value;
					}
				}
			}
			style = groups;
		}

		for (sn in style) {
			value = style[sn];
			var prefix = opts.fromArray ? '' : sn + ':';

			if (_.isString(value)) {
				var matches = value.match(regex);
				if (matches !== null) {
					code += prefix + matches[1] + ','; // matched a JS expression
				} else {
					if (typeof style.type !== 'undefined' && typeof style.type.indexOf === 'function' && (style.type).indexOf('UI.PICKER') !== -1 && value !== 'picker') {
						if (DATEFIELDS.indexOf(sn) !== -1) {
							// ALOY-263, support date/time style pickers
							var d = U.createDate(value);

							if (U.isValidDate(d, sn)) {
								code += prefix + 'new Date("' + d.toString() + '"),';
							}
						} else {
							code += prefix + '"' + value
								.replace(/"/g, '\\"')
								.replace(/\n/g, '\\n')
								.replace(/\r/g, '\\r')
								.replace(/\u2028/g, '\\u2028')
								.replace(/\u2029/g, '\\u2029') +  '",'; // just a string
						}
					} else {
						if (KEYBOARD_PROPERTIES.indexOf(sn) === -1) {
							code += prefix + '"' + value
								.replace(/"/g, '\\"')
								.replace(/\n/g, '\\n')
								.replace(/\r/g, '\\r')
								.replace(/\u2028/g, '\\u2028')
								.replace(/\u2029/g, '\\u2029') +  '",'; // just a string
						} else {
							// keyboard type shortcuts for TextField, TextArea
							// support shortcuts for keyboard type, return key type, and autocapitalization
							if (sn === KEYBOARD_PROPERTIES[0] && _.includes(KEYBOARD_TYPES, value.toUpperCase())) {
								code += prefix + 'Ti.UI.KEYBOARD_' + value.toUpperCase() + ',';
							}
							if (sn === KEYBOARD_PROPERTIES[1] && _.includes(RETURN_KEY_TYPES, value.toUpperCase())) {
								code += prefix + 'Ti.UI.RETURNKEY_' + value.toUpperCase() + ',';
							}
							if (sn === KEYBOARD_PROPERTIES[2] && _.includes(AUTOCAPITALIZATION_TYPES, value.toUpperCase())) {
								code += prefix + 'Ti.UI.TEXT_AUTOCAPITALIZATION_' + value.toUpperCase() + ',';
							}
						}
					}
				}
			} else if (_.isArray(value)) {
				code += prefix + '[';
				_.each(value, function(v) {
					processStyle(v, {fromArray:true});
				});
				code += '],';
			} else if (_.isObject(value)) {
				if (value[STYLE_ALLOY_TYPE] === 'var') {
					code += prefix + value.value + ','; // dynamic variable value
				} else {
					// recursively process objects
					code += prefix + '{';
					processStyle(value);
					code += '},';
				}
			} else {
				code += prefix + JSON.stringify(value) + ','; // catch all, just stringify the value
			}
		}
	}
	processStyle(_style, {firstOrder:true});

	return code;
};

exports.generateStyleParams = function(styles, classes, id, apiName, extraStyle, theState) {
	var styleCollection = [],
		lastObj = {},
		elementName = apiName.split('.').pop();

	// don't add an id to the generated style if we are in a local state
	if (theState && theState.local) {
		delete extraStyle.id;
	}

	// process all style items, in order
	_.each(styles, function(style) {
		if ((style.isId && style.key === id) ||
			(style.isClass && _.includes(classes, style.key)) ||
			(style.isApi && elementName === style.key)) {

			// manage potential runtime conditions for the style
			var conditionals = {
				platform: [],
				formFactor: ''
			};

			if (style.queries) {
				// handle platform device query
				// - Make compile time comparison if possible
				// - Add runtime conditional if platform is not known
				var q = style.queries;
				if (q.platform) {
					if (platform) {
						var isForCurrentPlatform = false;
						_.each(q.platform.toString().split(','), function(p) {
							// need to account for multiple platforms and negation, such as platform=ios or
							// platform=ios,android   or   platform=!ios   or   platform="android,!mobileweb"
							if (p === platform || (p.indexOf('!') === 0 && p.substr(1) !== platform)) {
								isForCurrentPlatform = true;
							}
						});
						if (!isForCurrentPlatform) {
							return;
						}
					} else {
						_.each(q.platform, function(p) {
							conditionals.platform.push(CU.CONDITION_MAP[p]['runtime']);
						});
					}
				}

				// handle formFactor device query
				if (q.formFactor === 'tablet') {
					conditionals.formFactor = 'Alloy.isTablet';
				} else if (q.formFactor === 'handheld') {
					conditionals.formFactor = 'Alloy.isHandheld';
				}

				// assemble runtime query
				var pcond = conditionals.platform.length > 0 ? '(' + conditionals.platform.join(' || ') + ')' : '';
				var joinString = (pcond && conditionals.formFactor) ? ' && ' : '';
				var conditional = pcond + joinString + conditionals.formFactor;
				if (q.if) {
					// ALOY-871: handle custom TSS queries with if conditional
					var ffcond = conditionals.formFactor.length > 0 ? '(' + conditionals.formFactor + ')' : '';
					var ffJoinString = (ffcond) ? ' && ' : '';
					conditional = pcond + joinString + ffcond + ffJoinString + '(' + q.if.split(',').join(' || ') + ')';
				}

				// push styles if we need to insert a conditional
				if (conditional) {
					if (lastObj) {
						styleCollection.push({style:lastObj});
						styleCollection.push({style:style.style, condition:conditional});
						lastObj = {};
					}
				} else if (!q.if) {
					lastObj = deepExtend(true, lastObj, style.style);
				}
			} else {
				// remove old style
				_.each(style.style, function(val, key) {
					if (_.isArray(val) && Object.prototype.hasOwnProperty.call(lastObj, key)) {
						delete lastObj[key];
					}
				});
				lastObj = deepExtend(true, lastObj, style.style);
			}
		}
	});

	// add in any final styles
	// ALOY-1363: deep merge necessary to properly merge children
	lastObj = deepExtend(true, lastObj, extraStyle || {});
	if (!_.isEmpty(lastObj)) { styleCollection.push({style:lastObj}); }

	// substitutions for binding
	_.each(styleCollection, function(style) {
		_.each(style.style, function(v, k) {

			if (!_.isString(v)) {
				return;
			}

			var bindingStrParts = v.split(BINDING_SPLIT_REGEX);

			if (bindingStrParts.length <= 1) {
				return;
			}

			var collectionModelVar = theState && theState.model ? theState.model : CONST.BIND_MODEL_VAR;

			var bindsModels = [];
			var bindsCollection = false;

			var bindingExpParts = [];

			bindingStrParts.forEach(function(part, i) {

				// empty string
				if (part === '') {
					return;
				}

				var partMatch = part.match(BINDING_REFERENCE_REGEX);

				// regular string
				if (!partMatch) {

					// escape single quote: ALOY-1478
					bindingExpParts.push("'" + part.replace(/'/g, "\\'") + "'");

					return;
				}

				var reference = partMatch[1].trim(); // trim: ALOY-716
				var referencePath = toPath(reference);

				var attribute, modelVar;

				// collection binding
				if (referencePath.length === 1) {
					bindsCollection = true;
				} else if (referencePath[0] === '$') {
					// instance model binding
					attribute = referencePath.splice(2, referencePath.length);
				} else if (collectionModelVar !== CONST.BIND_MODEL_VAR) {
					// collection binding (deep)
					bindsCollection = true;
				} else {
					// default to global model binding
					attribute = referencePath.splice(1, referencePath.length);
					referencePath.unshift('Alloy', 'Models');
				}

				// model binding
				if (attribute !== undefined) {
					modelVar = fromPath(referencePath);
					reference = fromPath(referencePath.concat(CONST.BIND_TRANSFORM_VAR, attribute));
					if (!_.includes(bindsModels, modelVar)) {
						bindsModels.push(modelVar);
					}
				} else {
					// collection binding
					reference = collectionModelVar + '.' + CONST.BIND_TRANSFORM_VAR + (reference[0] === '[' ? '' : '.') + reference;
				}

				bindingExpParts.push(reference);

			});

			if (!bindsCollection && bindsModels.length === 0) {
				return;
			}

			if (bindsCollection && bindsModels.length > 0) {
				U.die('Attempt to mix model (' + bindsModels.join(', ') + ') and collection (' + collectionModelVar + ') binding in: ' + v);
			}

			var bindingExp = bindingExpParts.join(' + ');

			if (bindsCollection) {
				style.style[k] = STYLE_EXPR_PREFIX + bindingExp;
			}

			if (bindsModels.length > 0) {

				bindsModels.forEach(function(modelVar) {

					// ensure that the bindings for this model have been initialized
					if (!exports.bindingsMap[modelVar]) {
						exports.bindingsMap[modelVar] = {
							models: bindsModels,
							bindings: []
						};
					} else {
						// ensure that mix use of models contains all
						exports.bindingsMap[modelVar].models = _.union(exports.bindingsMap[modelVar].models, bindsModels);
					}

					// create the binding object
					var bindingObj = {
						id: id,
						prop: k,
						val: bindingExp
					};

					// make sure bindings are wrapped in any conditionals
					// relevant to the curent style
					if (theState.condition) {
						bindingObj.condition = theState.condition;
					}

					// add this property to the global bindings map for the
					// current controller component
					exports.bindingsMap[modelVar].bindings.push(bindingObj);
				});

				// since this property is data bound, don't include it in
				// the style statically
				delete style.style[k];
			}
		});
	});

	// Let's assemble the fastest factory method object possible based on
	// what we know about the style we just sorted and assembled
	var code = '';
	if (styleCollection.length === 0) {
		code += '{}';
	} else if (styleCollection.length === 1) {
		if (styleCollection[0].condition) {
			// check the condition and return the object
			code += styleCollection[0].condition + ' ? {' + exports.processStyle(styleCollection[0].style, theState) + '} : {}';
		} else {
			// just return the object
			code += '{';
			code += exports.processStyle(styleCollection[0].style, theState);
			code += '}';
		}
	} else if (styleCollection.length > 1) {
		// construct self-executing function to merge styles based on runtime conditionals
		code += '(function (){\n';
		code += 'var o = {};\n';

		for (var i = 0, l = styleCollection.length; i < l; i++) {
			var tmpStyle = exports.processStyle(styleCollection[i].style, theState);
			if (!_.isEmpty(tmpStyle)) {
				if (styleCollection[i].condition) {
					code += 'if (' + styleCollection[i].condition + ') ';
				}
				code += 'Alloy.deepExtend(true, o, {';
				code += tmpStyle;
				code += '});\n';
			}
		}
		code += 'return o;\n';
		code += '})()';
	}

	return code;
};

function getCacheFilePath(appPath, hash) {
	return path.join(appPath, '..', CONST.DIR.BUILD, 'global_style_cache_' + hash + '.json');
}

// source: https://github.com/lodash/lodash/blob/3.8.1-npm-packages/lodash._topath/index.js
function toPath(value) {
	var result = [];
	value.replace(/[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\n\\]|\\.)*?)\2)\]/g, function(match, number, quote, string) {
		result.push(quote ? string.replace(/\\(\\)?/g, '$1') : (number || match));
	});
	return result;
}

function fromPath(path) {
	var result = path[0];

	if (path.length > 1) {
		result += '[' + path.slice(1).map(function(string) {
			return "'" + string.replace(/'/g, "\\'") + "'";
		}).join('][') + ']';
	}

	return result;
}
