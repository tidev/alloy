var CONST = require('alloy/constants'),
	_ = require('alloy/underscore')._;

exports.generateStyle = function(controller, opts) {
	var classes, apiName;

	// If there's no opts, there's no reason to load the style module. Just
	// return an empty object.
	if (!opts) { return {}; }

	// make opts.classes an array if it isn't already
	if (_.isArray(opts.classes)) {
		classes = opts.classes.slice(0);
	} else if (_.isString(opts.classes)) {
		classes = opts.classes.split(/\s+/);
	} else {
		classes = [];
	}

	// give opts.apiName a namespace if it doesn't have one already
	apiName = opts.apiName;
	if (apiName && apiName.indexOf('.') === -1) {
		apiName = addNamespace(apiName);
	}

	// TODO: check cached styles based on opts and controller

	// Load the runtime style for the given controller
	var styleArray = require('alloy/styles/' + controller);
	var styleFinal = {};

	// iterate through all styles
	var i, len;
	for (i = 0, len = styleArray.length; i < len; i++) {
		var style = styleArray[i];

		// give the apiName a namespace if necessary
		var styleApi = style.key;
		if (style.isApi && styleApi.indexOf('.') === -1) {
			styleApi = (CONST.IMPLICIT_NAMESPACES[styleApi] || 
				CONST.NAMESPACE_DEFAULT) + '.' + styleApi;
		}

		// does this style match the given opts?
		if ((style.isId && opts.id && style.key === opts.id) ||
			(style.isClass && _.contains(classes, style.key))) {
			// do nothing here, keep on processing
		} else if (style.isApi) {
			if (style.key.indexOf('.') === -1) {
				style.key = addNamespace(style.key);
			} 
			if (style.key !== apiName) { continue; }
		} else {
			// no matches, skip this style
			continue;
		}

		// can we clear out any form factor queries?
		if (style.queries && style.queries.formFactor && 
			!Alloy[style.queries.formFactor]) {
			continue;
		}

		// Merge this style into the existing style object
		_.extend(styleFinal, style.style);
	}

	// TODO: cache the style based on the opts and controller

	// Merge remaining extra style properties from opts, if any
	var extraStyle = _.omit(opts, ['class','apiName']);
	_.extend(styleFinal, extraStyle);

	return styleFinal;
};

function addNamespace(apiName) {
	return (CONST.IMPLICIT_NAMESPACES[apiName] || CONST.NAMESPACE_DEFAULT) + 
		'.' + apiName;
}