/**
 * Code in this file will attempt to optimize generated code so it's more compact
 * and executes faster, better, etc.
 */
var JSON_NULL = JSON.parse('null');

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
};
