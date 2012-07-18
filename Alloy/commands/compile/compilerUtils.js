var U = require('../../utils'),
	colors = require('colors'),
	path = require('path'),
	fs = require('fs'),
	wrench = require('wrench'),
	logger = require('../../common/logger'),
	jsp = require("../../uglify-js/uglify-js").parser,
	pro = require("../../uglify-js/uglify-js").uglify,
	_ = require('../../lib/alloy/underscore')._,
	optimizer = require('./optimizer'),
	CONST = require('../../common/constants');

///////////////////////////////////////
////////// private variables //////////
///////////////////////////////////////
var alloyRoot = path.join(__dirname,'..','..'),
	alloyUniqueIdPrefix = '__alloyId',
	alloyUniqueIdCounter = 0,
	JSON_NULL = JSON.parse('null'),
	compilerConfig;

///////////////////////////////
////////// constants //////////
///////////////////////////////
var STYLE_ALLOY_TYPE = '__ALLOY_TYPE__',
	STYLE_EXPR_PREFIX = '__ALLOY_EXPR__--',
	PLATFORMS = ['ios', 'android', 'mobileweb'],
	NS_TI_MAP = 'Ti.Map',
	NS_TI_MEDIA = 'Ti.Media',
	NS_TI_UI_IOS = 'Ti.UI.iOS',
	NS_TI_UI_IPAD = 'Ti.UI.iPad',
	NS_TI_UI_IPHONE = 'Ti.UI.iPhone',
	NS_TI_UI_MOBILEWEB = 'Ti.UI.MobileWeb',
	IMPLICIT_NAMESPACES = {
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
	},
	CONDITION_MAP = {
		android: {
			compile: 'OS_ANDROID',
			runtime: "Ti.Platform.osname === 'android'"
		},
		ios: {
			compile: 'OS_IOS',
			runtime: "Ti.Platform.osname === 'ipad' || Ti.Platform.osname === 'iphone'"
		},
		mobileweb: {
			compile: 'OS_MOBILEWEB',
			runtime: "Ti.Platform.osname === 'mobileweb'"
		}
	},
	RESERVED_ATTRIBUTES = ['id', 'class', 'require', 'platform'],
	RESERVED_EVENT_REGEX =  /^on([A-Z].+)/;

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
		ns = node.getAttribute('ns') || IMPLICIT_NAMESPACES[name] || 'Ti.UI',
		req = node.getAttribute('require'),
		id = node.getAttribute('id') || state.defaultId || exports.generateUniqueId(),
		platform = node.getAttribute('platform'),
		platformObj = {};

	// cleanup namespaces and nodes
	ns = ns.replace(/^Titanium\./, 'Ti');
	node.setAttribute('id', id);
	if (state.defaultId) { delete state.defaultId; }

	// process the platform attribute
	if (platform) {
		_.each((platform).split(','), function(p) {
			var matches = U.trim(p).match(/^(\!{0,1})(.+)/);
			if (matches !== null) {
				var negate = matches[1];
				var name = matches[2];
				if (_.contains(PLATFORMS, name)) {
					if (negate === '!') {
						_.each(_.without(PLATFORMS, name), function(n) {
							platformObj[n] = true;
						});
					} else {
						platformObj[name] = true;
					}
					return;
				}
			}
			U.die('Invalid platform type found: ' + p);
		});
	}

	// get create arguments and events from attributes
	var createArgs = {}, events = [];
	_.each(node.attributes, function(attr) {
		var attrName = attr.nodeName;
		if (_.contains(RESERVED_ATTRIBUTES, attrName)) { return; }
		var matches = attrName.match(RESERVED_EVENT_REGEX);
		if (matches !== null) {
			events.push({name:U.lcfirst(matches[1]),value:node.getAttribute(attrName)});
		} else {
			createArgs[attrName] = node.getAttribute(attrName);
		}
	});
	
	return {
		ns: ns,
		id: id, 
		fullname: ns + '.' + name,
		req: req,
		symbol: exports.generateVarName(id),
		classes: node.getAttribute('class').split(' ') || [],	
		parent: state.parent || {},
		platform: !platformObj ? undefined : platformObj,
		createArgs: createArgs,
		events: events
	};
};

exports.generateNode = function(node, state, defaultId, isRoot) {
	if (node.nodeType != 1) return '';
	if (defaultId) { state.defaultId = defaultId; }

	var args = exports.getParserArgs(node, state),
		codeTemplate = "if (<%= condition %>) {\n<%= content %>}\n",
		code = { content: '' };

	// Check for platform-specific considerations
	var conditionType = compilerConfig && compilerConfig.alloyConfig && compilerConfig.alloyConfig.platform ? 'compile' : 'runtime';
	if (args.platform) {
		var conditionArray = [];
		_.each(args.platform, function(v,k) {
			conditionArray.push(CONDITION_MAP[k][conditionType]);
		});
		code.condition = conditionArray.join(' || ');
	} 

	// Determine which parser to use for this node
	var parsersDir = path.join(alloyRoot,'commands','compile','parsers');
	var parserRequire = 'default';
	if (_.contains(fs.readdirSync(parsersDir), args.fullname+'.js')) {
		parserRequire = args.fullname+'.js';
	} 

	// Execute the appropriate tag parser and append code
	state = require('./parsers/' + parserRequire).parse(node, state) || { parent: {} };
	code.content += state.code;
	if (isRoot) { code.content += 'root$ = ' + args.symbol + ';\n'; }
	if (args.events && args.events.length > 0) {
		_.each(args.events, function(ev) {
			code.content += args.symbol + ".on('" + ev.name + "'," + ev.value + ");\n";	
		});	
	}

	// Continue parsing if necessary
	if (state.parent) {
		var states = _.isArray(state.parent) ? state.parent : [state.parent];
		_.each(states, function(p) {
			var parent = p.node;
			if (!parent) { return; }
			for (var i = 0, l = parent.childNodes.length; i < l; i++) {
				code.content += exports.generateNode(parent.childNodes.item(i), {
					parent: p,
					styles: state.styles,
				});
			}
		}); 
	}

	return code.condition ? _.template(codeTemplate, code) : code.content;
}

exports.copyWidgetAssets = function(assetsDir, resourceDir, widgetId) {
	if (!path.existsSync(assetsDir)) { return; }
	var files = wrench.readdirSyncRecursive(assetsDir);
	_.each(files, function(file) {
		var source = path.join(assetsDir, file);
		if (fs.statSync(source).isFile()) {
			var destDir = path.join(resourceDir, path.dirname(file), widgetId);
			var dest = path.join(destDir, path.basename(file));
			if (!path.existsSync(destDir)) {
				wrench.mkdirSyncRecursive(destDir, 0777);
			}
			//console.log('Copying assets ' + source + ' --> ' + dest);
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
	U.ensureDir(obj.dir.resources);
	U.ensureDir(obj.dir.resourcesAlloy);
	exports.generateConfig(obj.dir.config, alloyConfig, obj.dir.resourcesAlloy);

	// keep a copy of the config for this module
	compilerConfig = obj;

	return obj;
};

exports.generateConfig = function(configDir, alloyConfig, resourceAlloyDir) {
	var cf = path.join(configDir,'config.'+CONST.FILE_EXT.CONFIG);
	var o = {};

	// parse config.json, if it exists
	if (path.existsSync(cf)) {
		var jf = fs.readFileSync(cf);
		var j = JSON.parse(jf);
		o = j.global || {};
		if (alloyConfig) {
			o = _.extend(o, j['env:'+alloyConfig.deploytype]);
			o = _.extend(o, j['os:'+alloyConfig.platform]);
		}
	} else {
		logger.warn('No "app/config/config."' + CONST.FILE_EXT.CONFIG + ' file found');
	}

	// write out the config runtime module
	wrench.mkdirSyncRecursive(resourceAlloyDir, 0777);
	fs.writeFileSync(
		path.join(resourceAlloyDir,'CFG.js'),
		"module.exports = " + JSON.stringify(o) + ";\n"
	);
};

exports.loadController = function(file) {
	if (path.existsSync(file)) {
		return fs.readFileSync(file,'utf8');
	} else {
		return '';
	}
};

exports.loadStyle = function(p) {
	if (path.existsSync(p)) {
		var f = fs.readFileSync(p, 'utf8');

		// skip empty files
		if (/^\s*$/.test(f)) {
			return {};
		}

		// Handle "call" ASTs, where we look for expr() syntax
        function do_call() {
        	if (this[1][1] === 'expr') {
        		var code = pro.gen_code(this[2][0]);
        		var new_ast = ['string', STYLE_EXPR_PREFIX + code];
        		return new_ast;
        	} 
        };

        // Recursively assemble the full name of a dot-notation variable
        function processDot(dot,name) {
        	switch(dot[0]) {
        		case 'dot':
        			return processDot(dot[1], '.' + (dot[2] || '') + name);
        			break;
        		case 'name':
        			var pre = dot[1];
        			if (pre === 'Ti' || pre === 'Titanium' || pre === 'Alloy') {
        				return pre + name;
        			} else {
        				return null;
        			}
        			break;
        	}
        }

        // Handle all AST "dot"s, looking for Titanium constants
        function do_dot() {
        	var name = processDot(this,'');
        	if (name === null) {
        		return null;
        	} else {
        		return ['string', STYLE_EXPR_PREFIX + name];
        	}
        }

        // Generate AST and add the handlers for "call" and "dot" to the AST walker
        var ast = jsp.parse('module.exports = ' + f);
        //console.log(require('util').inspect(ast, false, null));
		var walker = pro.ast_walker();
		var new_ast = walker.with_walkers({
			"call": do_call,
			"dot": do_dot
		}, function(){
            return walker.walk(ast);
        });

        // generate code based on the new AST. Make sure to keep keys quoted so the
        // JSON parses without exception. The wild [1][0][1][3] array is how we grab 
        // just the style object from the AST, leaving behind the appended "module.exports = "
        var code = pro.gen_code(new_ast[1][0][1][3], { 
        	beautify: true, 
        	quote_keys: true,
        	keep_zeroes: true,
        	double_quotes: true
        });

		try {
			return JSON.parse(code);
		} catch(E) {
			console.error(code);
			U.die("Error parsing style at "+p.yellow+".  Error was: "+String(E).red);
		}
	}
	return {};
}

exports.createVariableStyle = function(keyValuePairs, value) {
	var style = {};

	if (!_.isArray(keyValuePairs)) {
		keyValuePairs = [[keyValuePairs, value]];
	}
	_.each(keyValuePairs, function(pair) {
		var k = pair[0];
		var v = pair[1];
		style[k] = { value:v };
		style[k][STYLE_ALLOY_TYPE] = 'var';
	});
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

exports.generateStyleParams = function(styles,classes,id,apiName,extraStyle) {
	var mergedStyle = mergeAllStyles(styles,classes,id,apiName,extraStyle),
		regex = new RegExp('^' + STYLE_EXPR_PREFIX + '(.+)'),
		str = [];

	function processStyle(style) {
		for (var sn in style) {
			var value = style[sn],
				actualValue;

			if (_.isString(value)) {
				var matches = value.match(regex);
				if (matches !== null) {
					actualValue = matches[1]; // matched a constant or expr()
				} else {
					actualValue = '"' + value + '"'; // just a string
				}
			} else if (_.isObject(value)) {
			 	if (value[STYLE_ALLOY_TYPE] === 'var') {
			 		actualValue = value.value; // dynamic variable value
			 	} else {
			 		// recursively process objects
			 		str.push({
			 			value: sn + ': {',
			 			useComma: false
			 		});
			 		processStyle(value);
			 		str.push('}');
			 		continue;
			 	}
			} else {
				actualValue = JSON.stringify(value); // catch all, just stringify the value
			}
			str.push(sn + ':' + actualValue);
		}
	}
	processStyle(mergedStyle);

	var finalStyle = '';
	_.each(str, function(line) {
		if (_.isObject(line)) {
			finalStyle += line.value + '\n';
		} else {
			finalStyle += line + ',\n';
		}
	});
	return finalStyle;
}

exports.processSourceCode = function(code, config, fn) 
{
	function show_copyright(comments) {
	        var ret = "";
	        for (var i = 0; i < comments.length; ++i) {
	                var c = comments[i];
	                if (c.type == "comment1") {
	                        ret += "//" + c.value + "\n";
	                } else {
	                        ret += "/*" + c.value + "*/";
	                }
	        }
	        return ret;
	};
	var c = jsp.tokenizer(code)();
	// extract header copyright so we can preserve it (if at the top of the file)
    var copyrights = show_copyright(c.comments_before);
	var ast = jsp.parse(code); 
	var newCode = exports.formatAST(ast,config,fn);
	return (copyrights ? copyrights + '\n' : '' ) + newCode;
};

exports.formatAST = function(ast,config,fn)
{
	// use the general defaults from the uglify command line
	var defines = {},
		DEFINES, 
		config;

	config = config || {};
	config.deploytype = config.deploytype || 'development';
	config.beautify = config.beautify || true;

	DEFINES = {
		OS_IOS : config.platform == 'ios',
		OS_ANDROID: config.platform == 'android',
		OS_MOBILEWEB: config.platform == 'mobileweb',
		ENV_DEV: config.deploytype == 'development',
		ENV_DEVELOPMENT: config.deploytype == 'development',
		ENV_TEST: config.deploytype == 'test',
		ENV_PROD: config.deploytype == 'production',
		ENV_PRODUCTION: config.deploytype == 'production'
	};

	for (var k in DEFINES) {
		defines[k] = [ "num", DEFINES[k] ? 1 : 0 ];
	}

	var isDev = config.deploytype === 'development';
	var options = 
	{
	        ast: false,
	        consolidate: !isDev,
	        mangle: !isDev,
	        mangle_toplevel: false,
	        no_mangle_functions: false,
	        squeeze: !isDev,
	        make_seqs: !isDev,
	        dead_code: true,
	        unsafe: false,
	        defines: defines,
	        lift_vars: false,
	        codegen_options: {
	                ascii_only: false,
	                beautify: config.beautify,
	                indent_level: 4,
	                indent_start: 0,
	                quote_keys: false,
	                space_colon: false,
	                inline_script: false
	        },
	        make: false,
	        output: false,
			except: ['Ti','Titanium','Alloy']
	};

	ast = pro.ast_mangle(ast,options); // get a new AST with mangled names
	ast = optimizer.optimize(ast, DEFINES, fn); // optimize our titanium based code
	ast = pro.ast_squeeze(ast); // get an AST with compression optimizations
	return pro.gen_code(ast,options.codegen_options); 
};

///////////////////////////////////////
////////// private functions //////////
///////////////////////////////////////
function mergeStyles(from, to) {
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

function mergeAllStyles(styles,classes,id,apiName,extraStyle) {
	var mergedStyle = {};
	extraStyle = extraStyle || {};

	// Start with any base View styles
	mergeStyles(styles['View'],mergedStyle);

	// Merge in styles based on UI component type
	mergeStyles(styles[U.properCase(apiName)],mergedStyle);

	// Merge in styles based on associated classes
	for (var c=0;c<classes.length;c++) {
		var clsn = classes[c];
		mergeStyles(styles['.'+clsn],mergedStyle);
	}

	// Merge in styles based on the component's ID
	mergeStyles(styles['#'+id],mergedStyle);
	if (id) mergedStyle['id'] = id;

	// Merge in any extra specified styles
	mergeStyles(extraStyle,mergedStyle);

	return mergedStyle;
}