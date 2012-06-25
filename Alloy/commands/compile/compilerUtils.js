var U = require('../../utils'),
	colors = require('colors'),
	path = require('path'),
	fs = require('fs'),
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

exports.loadStyle = function(p) {
	if (path.existsSync(p)) {
		var f = fs.readFileSync(p, 'utf8');

		// skip empty files
		if (/^\s*$/.test(f)) {
			return {};
		}

		f = f.replace(/Titanium\./g,"Ti.");
		// fixup constants so we can use them in JSON but then we do magic conversions
		f = f.replace(/Ti\.UI\.FILL/g,'"TI_UI_FILL"');
		f = f.replace(/Ti\.UI\.SIZE/g,'"TI_UI_SIZE"');
		f = f.replace(/Ti\.UI\.TEXT_ALIGNMENT_LEFT/g,'"TI_UI_TEXT_ALIGNMENT_LEFT"')
		f = f.replace(/Ti\.UI\.TEXT_ALIGNMENT_RIGHT/g,'"TI_UI_TEXT_ALIGNMENT_RIGHT"')
		f = f.replace(/Ti\.UI\.TEXT_ALIGNMENT_CENTER/g,'"TI_UI_TEXT_ALIGNMENT_CENTER"')
		try 
		{
			return JSON.parse(f);
		}
		catch(E)
		{
			U.die("Error parsing style at "+p.yellow+".  Error was: "+String(E).red);
		}
	}
	return {};
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