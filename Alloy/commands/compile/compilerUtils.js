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
	NS_ALLOY = 'Alloy',
	NS_TI_MAP = 'Ti.Map',
	NS_TI_MEDIA = 'Ti.Media',
	NS_TI_UI_IOS = 'Ti.UI.iOS',
	NS_TI_UI_IPAD = 'Ti.UI.iPad',
	NS_TI_UI_IPHONE = 'Ti.UI.iPhone',
	NS_TI_UI_MOBILEWEB = 'Ti.UI.MobileWeb',
	IMPLICIT_NAMESPACES = {
		// Alloy
		Require: NS_ALLOY,
		Include: NS_ALLOY,

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
	RESERVED_ATTRIBUTES = ['id', 'class', 'platform'],
	RESERVED_ATTRIBUTES_REQ_INC = ['id', 'class', 'platform', 'type', 'src'],
	RESERVED_EVENT_REGEX =  /^on([A-Z].+)/;

//////////////////////////////////////
////////// public interface //////////
//////////////////////////////////////
exports.getCompilerConfig = function() {
	return compilerConfig;
}

exports.generateVarName = function(id) {
	return '$.__views.' + id;
}

exports.generateUniqueId = function() {
	return alloyUniqueIdPrefix + alloyUniqueIdCounter++;
}

exports.getParserArgs = function(node, state) {
	state = state || {};
	var name = node.nodeName,
		ns = node.getAttribute('ns') || IMPLICIT_NAMESPACES[name] || CONST.NAMESPACE_DEFAULT,
		fullname = ns + '.' + name,
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
	var attrs = _.contains(['Alloy.Require'], fullname) ? RESERVED_ATTRIBUTES_REQ_INC : RESERVED_ATTRIBUTES;
	_.each(node.attributes, function(attr) {
		var attrName = attr.nodeName;
		if (_.contains(attrs, attrName) && attrName !== 'id') { return; }
		var matches = attrName.match(RESERVED_EVENT_REGEX);
		if (matches !== null) {
			events.push({name:U.lcfirst(matches[1]),value:node.getAttribute(attrName)});
		} else {
			createArgs[attrName] = node.getAttribute(attrName);
		}
	});
	
	return {
		ns: ns,
		name: name,
		id: id, 
		fullname: fullname,
		symbol: exports.generateVarName(id),
		classes: node.getAttribute('class').split(' ') || [],	
		parent: state.parent || {},
		platform: !platformObj ? undefined : platformObj,
		createArgs: createArgs,
		events: events
	};
};

exports.generateNode = function(node, state, defaultId, isTopLevel) {
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
	if (isTopLevel) { code.content += '$.addTopLevelView(' + args.symbol + ');\n'; }
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

exports.expandRequireNode = function(requireNode, doRecursive) {
	var cloneNode = requireNode.cloneNode(true),
		requires;

	function processRequire(node, isFirst) {
		var src = node.getAttribute('src'),
			type = node.getAttribute('type') || CONST.REQUIRE_TYPE_DEFAULT;

		// if no "src", just skip it, it'll get validated later
		if (!src) { 
			console.warn('Skipping element ' + node.nodeName + ' in "' + filename + '", no "src" attribute...');
			return; 
		}

		// Create view path and see if its already got the proper extension
		var fullpath = path.join(compilerConfig.dir.views,src);
		var regex = new RegExp('\\.' + CONST.FILE_EXT.VIEW + '$');
		if (!regex.test(fullpath)) {
			fullpath += '.' + CONST.FILE_EXT.VIEW;
		}

		// Make sure fullpath exists, skip if it doesn't
		if (!path.existsSync(fullpath)) {
			console.warn('Skipping element ' + node.nodeName + ' in "' + filename + '", no "src" path does not exist...');
			return;
		}

		// re-assemble XML with required elements
		if (isFirst) {
			cloneNode = U.XML.getDocRootFromFile(fullpath);
		} else {
			var newDocRoot = U.XML.getDocRootFromFile(fullpath);
			_.each(U.XML.getElementsFromNodes(newDocRoot.childNodes), function(n) {
				node.parentNode.appendChild(n);
			});
			node.parentNode.removeChild(node);
		}
	}

	// Need to loop this operation in case <Require> tags contain
	// other <Require> tags.
	processRequire(cloneNode, true);
	while ((requires = cloneNode.getElementsByTagName('Require')).length > 0) {
		_.each(requires, processRequire);
	}

	return cloneNode;
}

exports.copyWidgetResources = function(resources, resourceDir, widgetId) {
	_.each(resources, function(dir) {
		if (!path.existsSync(dir)) { return; }
		var files = wrench.readdirSyncRecursive(dir);
		_.each(files, function(file) {
			var source = path.join(dir, file);
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
	exports.generateConfig(obj.dir.home, alloyConfig, obj.dir.resourcesAlloy);

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
		logger.warn('No "app/config."' + CONST.FILE_EXT.CONFIG + ' file found');
	}

	// write out the config runtime module
	wrench.mkdirSyncRecursive(resourceAlloyDir, 0777);
	fs.writeFileSync(
		path.join(resourceAlloyDir,'CFG.js'),
		"module.exports = " + JSON.stringify(o) + ";\n"
	);
};

exports.loadController = function(file) {
	var code = {
		parentControllerName: '',
		controller: '',
		exports: ''
	};

	if (!path.existsSync(file)) {
		return code;
	}
	var contents = fs.readFileSync(file,'utf8');

    function checkAssigment() {
    	var target = this[2];
    	var value = this[3];
    	var match = pro.gen_code(target).match(/^exports\.(.+)/);

    	if (match !== null) {
            if (match[1] === 'baseController') {
    			code.parentControllerName = pro.gen_code(value);
    		} 		
    		code.exports += pro.gen_code(this) + ';\n';
    		return ['block'];
    	}
    }

    function do_stat() {
    	if (this[1][0] === 'assign') {
    		return checkAssigment.call(this[1]);
    	}
    }

    var ast = jsp.parse(contents);
	var walker = pro.ast_walker();
	var new_ast = walker.with_walkers({
		"stat": do_stat
	}, function(){
        return walker.walk(ast);
    });

    code.controller = pro.gen_code(new_ast);

	return code;
};

exports.loadStyle = function(tssFile) {
	if (path.existsSync(tssFile)) {
		var contents = fs.readFileSync(tssFile, 'utf8');
		if (!/^\s*$/gi.test(contents)) {
			contents = /^\s*\{[\s\S]+\}\s*$/gi.test(contents) ? contents : '{' + contents + '}';
			var code = processTssFile(contents);
			var json = JSON.parse(code);
			optimizer.optimizeStyle(json);
			return json;
		}
	}
	return {};
};

exports.loadAndSortStyle = function(tssFile) {
	return sortStyles(exports.loadStyle(tssFile));
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

exports.generateStyleParams = function(styles,classes,id,apiName,extraStyle) {
	var platform = compilerConfig && compilerConfig.alloyConfig && compilerConfig.alloyConfig.platform ? compilerConfig.alloyConfig.platform : undefined;
	var regex = new RegExp('^' + STYLE_EXPR_PREFIX + '(.+)'),
		styleCollection = [],
		lastObj = {};

	_.each(styles, function(style) {
		if ((style.isId && style.key === id) ||
			(style.isClass && _.contains(classes, style.key)) ||
			(style.isApi && style.key === apiName)) {
			
			// manage potential runtime conditions for the style
			var conditionals = {
				platform: [],
				size: ''
			};

			if (style.queries) {
				// handle platform device query
				// - Make compile time comparison if possible
				// - Add runtime conditional if platform is not known
				var q = style.queries;
				if (q.platform) {
					if (platform) {
						if (!_.contains(q.platform,platform)) {
							return;
						}
					} else {
						_.each(q.platform, function(p) {
							conditionals.platform.push(CONDITION_MAP[p]['runtime']);
						});
					}
				}

				// handle size device query
				if (q.size === 'tablet') {
					conditionals.size = 'Alloy.isTablet';
				} else if (q.size === 'handheld') {
					conditionals.size = 'Alloy.isHandheld';
				}

				// assemble runtime query
				var pcond = conditionals.platform.length > 0 ? '(' + conditionals.platform.join(' || ') + ')' : '';
				var joinString = pcond && conditionals.size ? ' && ' : '';
				var conditional = pcond + joinString + conditionals.size;

				// push styles if we need to insert a conditional
				if (conditional) {
					if (lastObj) {
						styleCollection.push({style:lastObj});
						styleCollection.push({style:style.style, condition:conditional});
						lastObj = {};
					}
				} else {
					_.extend(lastObj,style.style);
				}
			} else {
				_.extend(lastObj, style.style);
			}
		}
	});

	// add in any final styles
	_.extend(lastObj, extraStyle || {});
	if (!_.isEmpty(lastObj)) { styleCollection.push({style:lastObj}); }

	// console.log('--------' + id + ':' + classes + ':' + apiName + '-------------');
	// console.log(require('util').inspect(styleCollection, false, null));

	function processStyle(style, fromArray) {
		style = fromArray ? {0:style} : style;
		for (var sn in style) {
			var value = style[sn],
				prefix = fromArray ? '' : sn + ':',
				actualValue;

			if (_.isString(value)) {
				var matches = value.match(regex);
				if (matches !== null) {
					code += prefix + matches[1] + ','; // matched a constant or expr()
				} else {
					code += prefix + '"' + value + '",'; // just a string
				}
			} else if (_.isArray(value)) {
				code += prefix + '[';
				_.each(value, function(v) {
		 			processStyle(v, true);
		 		});
				code += '],';
			} else if (_.isObject(value)) {
			 	if (value[STYLE_ALLOY_TYPE] === 'var') {
			 		code += prefix + value.value + ','; // dynamic variable value
			 	} else {
			 		// recursively process objects
			 		code += prefix + '{';
			 		processStyle(value);
			 		code += '},';
			 	}
			} else {
				code += prefix + JSON.stringify(value) + ','; // catch all, just stringify the value
			}
		}
	}

	// Let's assemble the fastest factory method object possible based on
	// what we know about the style we just sorted and assembled
	var code = '';
	if (styleCollection.length === 0) {
		code += '{}';
	} else if (styleCollection.length === 1) {
		if (styleCollection[0].condition) {
			// check the condition and return the object
			code += styleCollection[0].condition + ' ? {' + processStyle(styleCollection[0].style) + '} : {}';
		} else {
			// just return the object
			code += '{';
			processStyle(styleCollection[0].style);
			code += '}';
		}
	} else if (styleCollection.length > 1) {
		// construct self-executing function to merge styles based on runtime conditionals
		code += '(function(){\n';
		code += 'var o = {};\n';
		for (var i = 0, l = styleCollection.length; i < l; i++) {
			if (styleCollection[i].condition) {
				code += 'if (' + styleCollection[i].condition + ') ';
			} 
			code += '_.extend(o, {';
			processStyle(styleCollection[i].style);
			code += '});\n';
		}
		code += 'return o;\n'
		code += '})()'
	}
	
	//console.log(code);

	return code;
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
	return (copyrights ? copyrights + '\n' : '' ) + code;
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
function processTssFile(f) {
	// Handle "call" ASTs, where we look for expr() syntax
    function do_call() {
    	var name = this[1][1];
    	var code;
    	if (name === 'expr') { 
    		code = pro.gen_code(this[2][0]);
    	} else if (name === 'L') {
    		code = pro.gen_code(this);
    	} else {
    		return null;
    	}
    	return ['string', STYLE_EXPR_PREFIX + code];
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
    return pro.gen_code(new_ast[1][0][1][3], { 
    	beautify: true, 
    	quote_keys: true,
    	ignore_numbers: true,
    	double_quotes: true
    }) || '';
}

function sortStyles(componentStyle) {
	var mergedStyle = {},
		regex = /^\s*([\#\.]{0,1})([^\[]+)(?:\[([^\]]+)\])*\s*$/,
		extraStyle = extraStyle || {},
		sortedStyles = [],
		ctr = 1,
		VALUES = {
			ID:     10000,
			CLASS:   1000,
			API:      100,
			PLATFORM:  10,
			SUM:        1,
			ORDER:      0.001
		};

	// add global style to processing, if present
	var styleList = [];
	if (compilerConfig && _.isObject(compilerConfig.globalStyle) && !_.isEmpty(compilerConfig.globalStyle)) { 
		styleList.push(compilerConfig.globalStyle);
	}
	if (_.isObject(componentStyle) && !_.isEmpty(componentStyle)) {
		styleList.push(componentStyle);
	}

	// Calculate priority:
	_.each(styleList, function(style) {
		for (var key in style) {
			var obj = {};
			var priority = ctr++ * VALUES.ORDER;
			var match = key.match(regex);
			if (match === null) {
				U.die('Invalid style specifier "' + key + '"');
			}
			var newKey = match[2];
			switch(match[1]) {
				case '#':
					obj.isId = true;
					priority += VALUES.ID;
					break;
				case '.':
					obj.isClass = true;
					priority += VALUES.CLASS;
					break;
				default:
					if (match[2]) {
						obj.isApi = true;
						priority += VALUES.API;
					}
					break;
			}

			if (match[3]) {
				obj.queries = {};
				_.each(match[3].split(/\s+/), function(query) {
					var parts = query.split('=');
					var q = U.trim(parts[0]);
					var v = U.trim(parts[1]);
					if (q === 'platform') {
						priority += VALUES.PLATFORM + VALUES.SUM;
						v = v.split(',');
					} else {
						priority += VALUES.SUM;
					}
					obj.queries[q] = v;
				});
			} 

			_.extend(obj, {
				priority: priority,
				key: newKey, 
				style: style[key]
			});
			sortedStyles.push(obj);
		}
	});

	return _.sortBy(sortedStyles, 'priority');
}

// testing style priority
if (require.main === module) {
	console.log(require('util').inspect(sortStyles({
		"#myview": {},
		"#myview[platform=ios]": {},
		"#myview[size=tablet]": {},
		".container[platform=android size=tablet]": {},
		"View[platform=ios]": {},
		"Label": {},
		".container[platform=android size=handheld]": {},
		".container": {}
	}), false, null));
	console.log('------------------------------');

}

