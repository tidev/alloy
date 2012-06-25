var U = require('../../utils'),
	alloyUniqueIdPrefix = '__alloyId',
	alloyUniqueIdCounter = 0,
	JSON_NULL = JSON.parse('null'),
	stylePrefix = '\t\t';

//////////////////////////////////////
////////// public interface //////////
//////////////////////////////////////
exports.generateVarName = function(id) {
	return '$.' + id;
}

exports.generateUniqueId = function() {
	return alloyUniqueIdPrefix + alloyUniqueIdCounter++;
}

exports.addStyleById = function(styles, id, key, value) {
	var idStr = '#' + id;
	if (!styles[idStr]) {
		styles[idStr] = {};
	} 
	styles[idStr][key] = value; 
	return styles;
} 

exports.generateStyleParams = function(styles,classes,id,className) {
	var s = {};

	// Start with any base View styles
	mergeStyles(styles['View'],s);

	// Merge in styles based on UI component type
	mergeStyles(styles[U.properCase(className)],s);

	// Merge in styles based on associated classes
	for (var c=0;c<classes.length;c++) {
		var clsn = classes[c];
		mergeStyles(styles['.'+clsn],s);
	}

	// Merge in styles based on the component's ID
	mergeStyles(styles['#'+id],s);
	if (id) s['id'] = id;
	var str = [];
	
	// Process any Titanium constants in the generated style
	var constants = {
		'TI_UI_FILL':'Ti.UI.FILL',
		'TI_UI_SIZE':'Ti.UI.SIZE',
		'TI_UI_TEXT_ALIGNMENT_LEFT':'Ti.UI.TEXT_ALIGNMENT_LEFT',
		'TI_UI_TEXT_ALIGNMENT_CENTER':'Ti.UI.TEXT_ALIGNMENT_CENTER',
		'TI_UI_TEXT_ALIGNMENT_RIGHT':'Ti.UI.TEXT_ALIGNMENT_RIGHT'
	};
	for (var sn in s)
	{
		var v = s[sn];
		var q = typeof(v) === 'string';
		var cf = constants[v];
		if (cf) {
			str.push(stylePrefix+sn+':'+cf);
		} else if (q) {
			str.push(stylePrefix+sn+':'+'"'+v+'"');
		} else {
			str.push(stylePrefix+sn+':'+ JSON.stringify(v));
		}
	}
	return str.join(",\n");
}

///////////////////////////////////////
////////// private functions //////////
///////////////////////////////////////
var mergeStyles = function(from, to) {
	if (from) {
		for (var k in from) {
			var v = from[k];
			// for optimization, remove null or undefined values
			if (v == JSON_NULL || typeof(v)==='undefined' || typeof(v)==='null') {
				delete to[k];
			} else {
				to[k] = from[k];
			}
		}
	}
}