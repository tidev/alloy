var U = require('../../utils'),
	colors = require('colors'),
	path = require('path'),
	fs = require('fs'),
	_ = require('../../lib/alloy/underscore')._;

var alloyRoot = path.join(__dirname,'..','..'),
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

exports.getParserArgs = function(node, state) {
	state = state || {};
	var name = node.nodeName,
		ns = node.getAttribute('ns') || 'Ti.UI',
		req = node.getAttribute('require'),
		id = node.getAttribute('id') || state.defaultId || req || exports.generateUniqueId();
	if (state.defaultId) { delete state.defaultId; }
	return {
		ns: ns,
		id: id, 
		fullname: ns + '.' + name,
		req: req,
		symbol: exports.generateVarName(id),
		classes: node.getAttribute('class').split(' ') || [],	
		parent: state.parent || {},
	};
};

exports.createCompileConfig = function(inputPath, outputPath, alloyConfig) {
	var dirs = ['assets','config','controllers','migrations','models','styles','views','widgets'];
	var libDirs = ['builtins','template'];
	var resources = path.resolve(path.join(outputPath,'Resources'));

	var obj = {
		alloyConfig: alloyConfig,
		runtimeConfig: '',
		dir: {
			home: path.resolve(inputPath),
			project: path.resolve(outputPath),
			resources: resources,
			resourcesAlloy: path.join(resources,'alloy')
		}
	};

	// create list of dirs
	_.each(dirs, function(dir) {
		obj.dir[dir] = path.resolve(path.join(inputPath,dir));
	});
	_.each(libDirs, function(dir) {
		obj.dir[dir] = path.resolve(path.join(alloyRoot,dir));
	});

	// validation
	var indexXml = path.join(obj.dir.views,'index.xml');
	if (!path.existsSync(indexXml)) {
		U.die('Alloy project must have an index.xml at ' + indexXml);
	}
	if (path.existsSync(obj.dir.config)) {
		obj.runtimeConfig = exports.generateConfig(obj.dir.config, alloyConfig);
	}
	U.ensureDir(obj.dir.resources);

	return obj;
};

// TODO: instead of dumping this full JSON in every file, create a commonjs
//       module for the config, then load it in each file. The loaded module
//       can then be assigned to CFG$ (or whatever else we want to name it)
exports.generateConfig = function(configDir, alloyConfig) {
	var cf = path.join(configDir,'config.json');
	if (path.existsSync(cf))
	{
		var jf = fs.readFileSync(cf);
		var j = JSON.parse(jf);
		var o = j.global || {};
		if (alloyConfig) {
			o = _.extend(o, j['env:'+alloyConfig.deploytype]);
			o = _.extend(o, j['os:'+alloyConfig.platform]);
		}
		return "CFG$ = " + JSON.stringify(o) + ";\n";
	}
	return '';
};

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

exports.generateStyleParams = function(styles,classes,id,className,extraStyle) {
	var s = {};
	extraStyle = extraStyle || {};

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

	// Merge in any extra specified styles
	mergeStyles(extraStyle,s);
	
	// Process any Titanium constants in the generated style
	var constants = {
		'TI_UI_FILL':'Ti.UI.FILL',
		'TI_UI_SIZE':'Ti.UI.SIZE',
		'TI_UI_TEXT_ALIGNMENT_LEFT':'Ti.UI.TEXT_ALIGNMENT_LEFT',
		'TI_UI_TEXT_ALIGNMENT_CENTER':'Ti.UI.TEXT_ALIGNMENT_CENTER',
		'TI_UI_TEXT_ALIGNMENT_RIGHT':'Ti.UI.TEXT_ALIGNMENT_RIGHT'
	};

	//console.log(s);
	for (var sn in s) {
		var v = s[sn];
		var q = typeof(v) === 'string';
		var cf = constants[v];
		if (cf) {
			str.push(stylePrefix+sn+':'+cf);
		} else if (q) {
			str.push(stylePrefix+sn+':'+'"'+v+'"');
		} else {
			if (_.isObject(v) && v.alloyType === 'var') {
				str.push(stylePrefix+sn+':'+v.value);
			} else {
				str.push(stylePrefix+sn+':'+ JSON.stringify(v));
			}
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