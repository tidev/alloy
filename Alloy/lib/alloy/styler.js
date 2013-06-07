var CONST = require('alloy/constants'),
	_ = require('alloy/underscore')._;

exports.generateStyle = function(controller, opts) {
	// If there's no opts, there's no reason to load the style module. Just
	// return an empty object.
	if (!opts) { return {}; }

	// make opts.class an array if it isn't already
	if (!_.isArray(opts.class)) {
		opts.class = _.isString(opts.class) ? opts.class.split(/\s+/) : [];
	}

	// give opts.apiName a namespace if it doesn't have one already
	if (opts.apiName && opts.apiName.indexOf('.') === -1) {
		opts.apiName = addNamespace(opts.apiName);
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
			(style.isClass && _.contains(opts.class, style.key))) {
			// do nothing here, keep on processing
		} else if (style.isApi) {
			if (style.key.indexOf('.') === -1) {
				style.key = addNamespace(style.key);
			} 
			if (style.key !== opts.apiName) { continue; }
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