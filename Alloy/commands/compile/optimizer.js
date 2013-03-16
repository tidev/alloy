/** 
 * Code in this file will attempt to optimize generated code so it's more compact
 * and executes faster, better, etc.
 */
var uglifyjs = require('uglify-js'),
	_ = require('../../lib/alloy/underscore')._,
	logger = require('../../common/logger.js');

var JSON_NULL = JSON.parse('null');

function dotCheck(node, name) {
	return node instanceof uglifyjs.AST_Dot && node.property === name;
}

function subCheck(node, name) {
	return node instanceof uglifyjs.AST_Sub && node.property.value === name;
}

function dotSubCheck(node, name) {
	return dotCheck(node, name) || subCheck(node, name);
}

// Optimize Titanium namespaces with static strings where possible
exports.optimize = function(ast, defines, fn) {
	var platform = {};

	// determine platform name from defines
	if (defines.OS_IOS) { 
		platform.name = 'iPhone OS'; 
		platform.osname = undefined;
	} else if (defines.OS_ANDROID) { 
		platform.osname = platform.name = 'android'; 
	} else if (defines.OS_MOBILEWEB) { 
		platform.osname = platform.name = 'mobileweb'; 
	} else {
		platform.osname = platform.name = undefined;
	}

	// Walk tree transformer changing (Ti|Titanium).Platform.(osname|name)
	// into static strings where possible. This will allow the following
	// compression step to reduce the code further.
	var transformer = new uglifyjs.TreeTransformer(function(node, descend){
		var convert = false;
		if (dotSubCheck(node, 'name') || dotSubCheck(node, 'osname')) {
			descend(node, new uglifyjs.TreeTransformer(function(node, descend) {
				if (dotSubCheck(node, 'Platform')) {
					descend(node, new uglifyjs.TreeTransformer(function(node) {
						if (node instanceof uglifyjs.AST_SymbolRef && 
							(node.name === 'Titanium' || node.name === 'Ti')) {
							convert = true;
						} 
						return node;
					}));
				} 
				return node;
			}));
			if (convert) {
				var value = node instanceof uglifyjs.AST_Dot ? node.property : node.property.value;
				if (platform[value]) {
					return new uglifyjs.AST_String({
						start: node.start,
						end: node.end,
						value: platform[value]
					});
				} else {
					return node;
				}
			}
			return node;
		}
	});
	return ast.transform(transformer);
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
