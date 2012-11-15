/** 
 * Code in this file will attempt to optimize generated code so it's more compact
 * and executes faster, better, etc.
 */
var jsp = require("../../uglify-js/uglify-js").parser,
	pro = require("../../uglify-js/uglify-js").uglify,
	_ = require('../../lib/alloy/underscore')._,
	util = require('util'),
	colors = require('colors'),
	logger = require('../../common/logger.js'),
	U = require('../../utils'),
	platformDefines,
	platformName, 
	platformOsName;

var JSON_NULL = JSON.parse('null');

function getVariableStringValue(a)
{
	var e = a;
	var p = '';
	while(e[0]==='dot' || e[0]==='name' || e[0]==='string' || e[0]==='sub')
	{
		if (e[0]==='sub') // sub is like foo['bar'] which we turn to foo.bar
		{
			p = e[2][1] + '.' + p;
		}
		else
		{
			p = (e[0] == 'dot' ? e[2] : e[1]) + '.' + p;
		}
		e = e[1];
	}
	return p.substring(0,p.length-1);
}

// Replace the Ti.Platform variables with strings, when possible. We don't need to do 
// anything else. uglifyjs will take care of optimization for us by eliminating dead
// code based on string to string comparisons in the ast_squeeze() step.
function processObject() {
	var translate = getVariableStringValue(this);
	if (_.contains(['Ti.Platform.name','Titanium.Platform.name'], translate) && platformName) {
		return ['string',platformName];
	} else if (_.contains(['Ti.Platform.osname','Titanium.Platform.osname'], translate) && platformOsName) {
		return ['string',platformOsName];
	}
	return null;
}

// strips null and undefined values out of Alloy styles
exports.optimizeStyle = function(styleList) {
	for (var style in styleList) {
		for (var key in styleList[style]) {
			var v = styleList[style][key];
			if (v == JSON_NULL || typeof(v) === 'undefined' || typeof(v) === 'null') {
				delete styleList[style][key];
			} 
		}
	}
}

// main function for optimizing runtime Titanium Javascript code
function optimize(ast, defines, fn) {
	try {
		platformDefines = defines;

		// determine platform name from defines
		if (platformDefines.OS_IOS) { 
			platformName = 'iPhone OS'; 
			platformOsName = null;
		} else if (platformDefines.OS_ANDROID) { 
			platformOsName = platformName = 'android'; 
		} else if (platformDefines.OS_MOBILEWEB) { 
			platformOsName = platformName = 'mobileweb'; 
		} else {
			platformName = platformOsName = null;
		}

		// walk the AST looking for ifs and vars
		var w = pro.ast_walker();
		return w.with_walkers({
				"dot": processObject,
				"sub": processObject
		}, function() {
			return w.walk(ast);
		});
	} catch (e) {
		logger.error('Error compiling source (' + fn + '). ' + e + '\n' + e.stack);
		return ast;
	}
}

exports.optimize = optimize;

