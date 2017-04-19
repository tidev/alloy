/**
 * Code in this file will attempt to optimize generated code so it's more compact
 * and executes faster, better, etc.
 */
var JSON_NULL = JSON.parse('null');

var isTiPlatformOsnameExpression = types.buildMatchMemberExpression('Ti.Platform.osname');
var isTiPlatformNameExpression = types.buildMatchMemberExpression('Ti.Platform.name');
var isTitaniumPlatformOsnameExpression = types.buildMatchMemberExpression('Titanium.Platform.osname');
var isTitaniumPlatformNameExpression = types.buildMatchMemberExpression('Titanium.Platform.name');

// Optimize Titanium namespaces with static strings where possible
exports.optimize = function(ast, defines, fn) {
	//var platform = {};
	var theKey;
	_.find(defines, function(value, key) {
		var ret = key.indexOf('OS_') === 0 && value;
		if (ret) { theKey = key; }
		return ret;
	});
	if (!theKey) { return ast; }

	// make sure the platform require includes
	var platformString = theKey.substring(3).toLowerCase();
	var platformPath = path.join(__dirname, '..', '..', '..', 'platforms', platformString, 'index');
	if (!fs.existsSync(platformPath + '.js')) { return ast; }

	// create, transform, and validate the platform object
	var platform = require(platformPath);
	if (!_.isString(platform.name)) { platform.name = undefined; }
	if (!_.isString(platform.osname)) { platform.osname = undefined; }
	if (!platform.osname && !platform.name) { return ast; }

	// Walk tree transformer changing (Ti|Titanium).Platform.(osname|name)
	// into static strings where possible. This will allow the following
	// compression step to reduce the code further.
	traverse(ast, {
		enter(path) {
			if (platform.osname && (isTiPlatformOsnameExpression(path.node) || isTitaniumPlatformOsnameExpression(path.node))) {
				path.replaceWith(types.stringLiteral(platform.osname));
			} else if (platform.name && (isTiPlatformNameExpression(path.node) || isTitaniumPlatformNameExpression(path.node))) {
				path.replaceWith(types.stringLiteral(platform.name));
			}
		}
	});
	return ast;
};

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
