var U = require('../../utils'),
	colors = require('colors'),
	path = require('path'),
	fs = require('fs'),
	wrench = require('wrench'),
	_ = require('../../lib/alloy/underscore')._;

var alloyRoot = path.join(__dirname,'..','..'),
	alloyUniqueIdPrefix = '__alloyId',
	alloyUniqueIdCounter = 0,
	JSON_NULL = JSON.parse('null'),
	stylePrefix = '\t\t';

var NS_TI_MAP = 'Ti.Map',
	NS_TI_MEDIA = 'Ti.Media',
	NS_TI_UI_IOS = 'Ti.UI.iOS',
	NS_TI_UI_IPAD = 'Ti.UI.iPad',
	NS_TI_UI_IPHONE = 'Ti.UI.iPhone',
	NS_TI_UI_MOBILEWEB = 'Ti.UI.MobileWeb';

var implicitNamespaces = {
	// Ti.Map
	Annotation: NS_TI_MAP,

	// Ti.Media
	VideoPlayer: NS_TI_MEDIA,
	MusicPlayer: NS_TI_MEDIA,

	// Ti.UI.iOS
	AdView: NS_TI_UI_IOS,
	CoverFlowView: NS_TI_UI_IOS,
	TabbedBar: NS_TI_UI_IOS,
	Toolbar: NS_TI_UI_IOS,

	// Ti.UI.iPad
	DocumentViewer: NS_TI_UI_IPAD,
	Popover: NS_TI_UI_IPAD,
	SplitWindow: NS_TI_UI_IPAD,

	// Ti.UI.iPhone
	NavigationGroup: NS_TI_UI_IPHONE, // I know MobileWeb has one, but 99% will be this one
	StatusBar: NS_TI_UI_IPHONE,
};

exports.STYLE_ALLOY_TYPE = '__ALLOY_TYPE__';
exports.STYLE_CONST_PREFIX = '__ALLOY_CONST__:';

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
		ns = node.getAttribute('ns') || implicitNamespaces[name] || 'Ti.UI',
		req = node.getAttribute('require'),
		id = node.getAttribute('id') || state.defaultId || req || exports.generateUniqueId();

	ns = ns.replace(/^Titanium\./, 'Ti');
	node.setAttribute('id', id);
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

exports.copyWidgetAssets = function(assetsDir, resourceDir, widgetId) {
	var files = wrench.readdirSyncRecursive(assetsDir);
	_.each(files, function(file) {
		var source = path.join(assetsDir, file);
		if (fs.statSync(source).isFile()) {
			var destDir = path.join(resourceDir, path.dirname(file), widgetId);
			var dest = path.join(destDir, path.basename(file));
			if (!path.existsSync(destDir)) {
				wrench.mkdirSyncRecursive(destDir, 0777);
			}
			console.log('Copying assets ' + source + ' --> ' + dest);
			U.copyFileSync(source, dest);
		}
	});
}

// "Empty" states are generally used when you want to create a 
// Titanium component with no parent
exports.createEmptyState = function(styles) {
	return {
		parent: {},
		styles: styles
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

		// use Ti namespace
		f = f.replace(/Titanium\./g,"Ti.");

		// find constants
		// TODO: This needs work. There's still an off chance that this could 
		//       match content in a string. Or that the STYLE_CONST_PREFIX could
		//       appear in other style strings. Extremely unlikely, but possible.
		f = f.replace(/\:\s*(Ti\.[^\s\,\}]+)/g, ': "' + exports.STYLE_CONST_PREFIX + '$1"');
		
		try {
			return JSON.parse(f);
		} catch(E) {
			U.die("Error parsing style at "+p.yellow+".  Error was: "+String(E).red);
		}
	}
	return {};
}

exports.createVariableStyle = function(keyValuePairs, value) {
	var style = {},
		key, value;
	if (_.isArray(keyValuePairs)) {
		_.each(keyValuePairs, function(pair) {
			var k = pair[0];
			var v = pair[1];
			style[k] = { value:v };
			style[k][exports.STYLE_ALLOY_TYPE] = 'var';
		});
	} else {
		style[keyValuePairs] = { value:value };
		style[keyValuePairs][exports.STYLE_ALLOY_TYPE] = 'var';
	}
	return style;
};

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

	var regex = new RegExp('^' + exports.STYLE_CONST_PREFIX + '(.+)');
	for (var sn in s) {
		var value = s[sn],
			actualValue;

		if (_.isString(value)) {
			var matches = value.match(regex);
			if (matches !== null) {
				actualValue = matches[1]; // matched a constant
			} else {
				actualValue = '"' + value + '"'; // just a string
			}
		} else if (_.isObject(value) && value[exports.STYLE_ALLOY_TYPE] === 'var') {
			actualValue = value.value; // dynamic variable value
		} else {
			actualValue = JSON.stringify(value); // catch all, just stringify the value
		}
		str.push(stylePrefix + sn + ':' + actualValue);
	}
	return str.join(',\n');
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