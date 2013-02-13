var U = require('../../utils'),
	colors = require('colors'),
	path = require('path'),
	fs = require('fs'),
	wrench = require('wrench'),
	jsonlint = require('jsonlint'),
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
		},
		handheld: {
			runtime: "!Alloy.isTablet"
		},
		tablet: {
			runtime: "Alloy.isTablet"
		}
	},
	RESERVED_ATTRIBUTES = ['id', 'class', 'platform', 'formFactor', CONST.BIND_COLLECTION, CONST.BIND_WHERE],
	RESERVED_ATTRIBUTES_REQ_INC = ['id', 'class', 'platform', 'type', 'src', 'formFactor', CONST.BIND_COLLECTION, CONST.BIND_WHERE],
	RESERVED_EVENT_REGEX =  /^on([A-Z].+)/;

exports.bindingsMap = {};
exports.destroyCode = '';
exports.postCode = '';

//////////////////////////////////////
////////// public interface //////////
//////////////////////////////////////
exports.getCompilerConfig = function() {
	return compilerConfig;
}

exports.generateVarName = function(id, name) {
	if (_.contains(CONST.JS_RESERVED_ALL,id)) {
		U.die([
			'Invalid ID "' + id + '" for <' + name + '>.',
			'Can\'t use reserved Javascript words as IDs.',
			'Reserved words: [' + CONST.JS_RESERVED_ALL.sort().join(',') + ']'
		]);
	}
	return '$.__views.' + id;
}

exports.generateUniqueId = function() {
	return alloyUniqueIdPrefix + alloyUniqueIdCounter++;
}

exports.getNodeFullname = function(node) {
	var name = node.nodeName,
		ns = node.getAttribute('ns') || CONST.IMPLICIT_NAMESPACES[name] || CONST.NAMESPACE_DEFAULT,
		fullname = ns + '.' + name;

	return fullname;
}

exports.getParserArgs = function(node, state, opts) {
	state || (state = {});
	opts || (opts = {});

	var defaultId = opts.defaultId || undefined,
		doSetId = opts.doSetId === false ? false : true,
		name = node.nodeName,
		ns = node.getAttribute('ns') || CONST.IMPLICIT_NAMESPACES[name] || CONST.NAMESPACE_DEFAULT,
		fullname = ns + '.' + name,
		id = node.getAttribute('id') || defaultId || exports.generateUniqueId(),
		platform = node.getAttribute('platform'),
		formFactor = node.getAttribute('formFactor'),
		platformObj;

	// handle binding arguments
	var bindObj = {};
	bindObj[CONST.BIND_COLLECTION] = node.getAttribute(CONST.BIND_COLLECTION);
	bindObj[CONST.BIND_WHERE] = node.getAttribute(CONST.BIND_WHERE); 
	bindObj[CONST.BIND_TRANSFORM] = node.getAttribute(CONST.BIND_TRANSFORM); 
	bindObj[CONST.BIND_FUNCTION] = node.getAttribute(CONST.BIND_FUNCTION); 

	// cleanup namespaces and nodes
	ns = ns.replace(/^Titanium\./, 'Ti.');
	if (doSetId && !_.contains(CONST.MODEL_ELEMENTS, fullname)) { 
		node.setAttribute('id', id); 
	}

	// process the platform attribute
	if (platform) {
		platformObj = {};
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
	var createArgs = {}, 
		events = [];
	var attrs = _.contains(['Alloy.Require'], fullname) ? RESERVED_ATTRIBUTES_REQ_INC : RESERVED_ATTRIBUTES;
	_.each(node.attributes, function(attr) {
		var attrName = attr.nodeName;
		if (_.contains(attrs, attrName) && attrName !== 'id') { return; }
		var matches = attrName.match(RESERVED_EVENT_REGEX);
		if (matches !== null) {
			events.push({name:U.lcfirst(matches[1]),value:node.getAttribute(attrName)});
		} else {
			var theValue = node.getAttribute(attrName);
			/^(?:Ti|Titanium)\./.test(theValue) && (theValue = STYLE_EXPR_PREFIX + theValue);
			createArgs[attrName] = theValue;
		}
	});
	
	return _.extend({
		ns: ns,
		name: name,
		id: id, 
		fullname: fullname,
		formFactor: node.getAttribute('formFactor'),
		symbol: exports.generateVarName(id, name),
		classes: node.getAttribute('class').split(' ') || [],	
		parent: state.parent || {},
		platform: platformObj,
		createArgs: createArgs,
		events: events
	}, bindObj);
};

exports.generateCode = function(ast) {
	var opts = {
        indent_start : 0,     // Base indentation for lines
        indent_level : 4,     // Indentation increment for nested lines
        quote_keys   : false, // Quote keys in objects?
        space_colon  : false, // Put a space between keys and colons?
        beautify     : true,  // Beautify the generated code?
        ascii_only   : false, // Process only ascii characters
        inline_script: false, // Compress <script> tags?
        double_quotes: true,  // Always use double quotes to contain strings (necessary for JSON processing)
        ignore_numbers: true  // Don't try to compress numbers
    };
	return pro.gen_code(ast, opts);
}

exports.generateNodeExtended = function(node, state, newState) {
	return exports.generateNode(node, _.extend(_.clone(state), newState));
}

exports.generateNode = function(node, state, defaultId, isTopLevel, isModelOrCollection) {
	if (node.nodeType != 1) return '';

	var args = exports.getParserArgs(node, state, { defaultId: defaultId }),
		codeTemplate = "if (<%= condition %>) {\n<%= content %>}\n",
		code = { 
			content: '',
			pre: '' 
		};

	// Check for platform specific considerations
	var conditionType = compilerConfig && compilerConfig.alloyConfig && compilerConfig.alloyConfig.platform ? 'compile' : 'runtime';
	if (args.platform) {
		var conditionArray = [];
		_.each(args.platform, function(v,k) {
			conditionArray.push(CONDITION_MAP[k][conditionType]);
		});
		
		code.condition = '(' + conditionArray.join(' || ') + ')';
	}
	
	//Add form factor condition, if application form-factor specific runtime check
	if (args.formFactor && CONDITION_MAP[args.formFactor]) {
		var check = CONDITION_MAP[args.formFactor].runtime;
		code.condition = (code.condition) ? code.condition += ' && ' + check : check;
	}

	// pass relevant conditional information in state
	if (code.condition) {
		if (state.condition) {
			state.condition += '&&' + code.condition;
		} else {
			state.condition = code.condition;
		}
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
	args.symbol = state.args && state.args.symbol ? state.args.symbol : args.symbol;
	if (isTopLevel) { code.content += '$.addTopLevelView(' + args.symbol + ');'; }

	// handle any model/collection code
	if (state.modelCode) {
		code.pre += state.modelCode;
		delete state.modelCode;
	}

	// handle any events from markup
	if (args.events && args.events.length > 0) {
		// determine which function name to use for event handling:
		// * addEventListener() for Titanium proxies
		// * on() for everything else (controllers, models, collections)
		var eventFunc = /^(?:Ti|Titanium)\./.test(args.fullname) ? 'addEventListener' : 'on';

		_.each(args.events, function(ev) {
			var eventObj = {
				obj: args.symbol,
				ev: ev.name,
				cb: ev.value,
				func: eventFunc
			};

			// create templates for immediate and deferred event handler creation
			var theDefer = _.template("__defers['<%= obj %>!<%= ev %>!<%= cb %>']", eventObj);
			var theEvent = _.template("<%= obj %>.<%= func %>('<%= ev %>',<%= cb %>)", eventObj);
			var immediateTemplate = "<%= cb %>?" + theEvent + ":" + theDefer + "=true;";
			var deferTemplate = theDefer + " && " + theEvent + ";";

			// add the generated code to the view code and post-controller code respectively
			code.content += _.template(immediateTemplate, eventObj);
			exports.postCode += _.template(deferTemplate, eventObj);
		});	
	}

	// Continue parsing if necessary
	if (state.parent) {
		var states = _.isArray(state.parent) ? state.parent : [state.parent];
		_.each(states, function(p) {
			var parent = p.node;
			if (!parent) { return; }
			for (var i = 0, l = parent.childNodes.length; i < l; i++) {
				var newState = _.defaults({ parent: p }, state);
				code.content += exports.generateNode(parent.childNodes.item(i), newState); 
			}
		}); 
	}
	
	if (!isModelOrCollection) {
		return code.condition ? _.template(codeTemplate, code) : code.content;
	} else {
		return {
			content: code.condition ? _.template(codeTemplate, code) : code.content,
			pre: code.condition ? _.template(codeTemplate, {content:code.pre}) : code.pre
		};
	}
}

exports.componentExists = function(appRelativePath, manifest) {
	var isWidget = manifest;
	var config = exports.getCompilerConfig();

	// Prepare the path the is relative the the "app" directory
	var stripPsRegex  = new RegExp('^(?:' + CONST.PLATFORM_FOLDERS_ALLOY.join('|') + ')[\\\\\\/]*');
	var stripExtRegex = new RegExp('\\.(?:' + CONST.FILE_EXT.VIEW + '|' + CONST.FILE_EXT.CONTROLLER + ')$');
	var basename = appRelativePath.replace(stripPsRegex,'').replace(stripExtRegex,'');

	// compose potential component path
	var componentPath = path.join(
		config.dir.resourcesAlloy,
		CONST.DIR.COMPONENT,
		basename + '.' + CONST.FILE_EXT.COMPONENT
	);

	if (isWidget) {
		componentPath = path.join(
			config.dir.resourcesAlloy, 
			CONST.DIR.WIDGET, 
			manifest.id, 
			CONST.DIR.COMPONENT, 
			basename + '.' + CONST.FILE_EXT.COMPONENT
		);
	} 

	return path.existsSync(componentPath);
}

exports.expandRequireNode = function(requireNode, doRecursive) {
	var cloneNode = requireNode.cloneNode(true);

	function getViewRequirePath(node) {
		var src = node.getAttribute('src'),
			type = node.getAttribute('type') || CONST.REQUIRE_TYPE_DEFAULT,
			fullname = exports.getNodeFullname(node);

		// Must be a view, with a valid src, in a <Require> element
		if (fullname !== 'Alloy.Require' || !src || type !== 'view') {
			return null;
		}

		// Create view path and see if its already got the proper extension
		var fullpath = path.join(compilerConfig.dir.views,src);
		var regex = new RegExp('\\.' + CONST.FILE_EXT.VIEW + '$');
		if (!regex.test(fullpath)) {
			fullpath += '.' + CONST.FILE_EXT.VIEW;
		}

		// Make sure fullpath exists, skip if it doesn't
		if (!path.existsSync(fullpath)) {
			U.die('view "' + src + '" at path "' + fullpath + '" does not exist.');
		}

		return fullpath;
	}

	//create function, it expects 2 values.
	function insertAfter(newElement,targetElement) {
		//target is what you want it to go after. Look for this elements parent.
		var parent = targetElement.parentNode;
	 
		//if the parents lastchild is the targetElement...
		if(parent.lastchild == targetElement) {
			//add the newElement after the target element.
			parent.appendChild(newElement);
			} else {
			// else the target has siblings, insert the new element between the target and it's next sibling.
			parent.insertBefore(newElement, targetElement.nextSibling);
		}
	}

	function processRequire(node, isFirst) {
		// make sure we have a valid required view and get its path
		var fullpath = getViewRequirePath(node);
		if (fullpath === null) {
			return;
		}

		// re-assemble XML with required elements
		if (isFirst) {
			cloneNode = U.XML.getAlloyFromFile(fullpath);
		} else {
			var newDocRoot = U.XML.getAlloyFromFile(fullpath);
			_.each(U.XML.getElementsFromNodes(newDocRoot.childNodes), function(n) {
				insertAfter(n, node);
			});

			node.parentNode.removeChild(node);
		}
	}

	// Expand the <Require>, recursively if specified
	if (getViewRequirePath(cloneNode) !== null) {
		processRequire(cloneNode, true);
		while (doRecursive) {
			var reqs = cloneNode.getElementsByTagName('Require');
			var viewRequires = _.filter(reqs, function(req) {
				return getViewRequirePath(req) !== null;
			});

			if (viewRequires.length === 0) {
				break;
			}

			// TODO: https://jira.appcelerator.org/browse/ALOY-256
			//_.each(viewRequires, processRequire);
			processRequire(viewRequires[0]);
		}
	}

	return cloneNode;
}

exports.inspectRequireNode = function(node) {
	var newNode = exports.expandRequireNode(node, true);
	var children = U.XML.getElementsFromNodes(newNode.childNodes);
	var names = [];

	_.each(children, function(c) {
		var args = exports.getParserArgs(c);

		// skip model elements when inspecting nodes for <Require>
		if (_.contains(CONST.MODEL_ELEMENTS, args.fullname)) {
			newNode.removeChild(c);
			return;
		}

		names.push(args.fullname);
	});

	return {
		children: U.XML.getElementsFromNodes(newNode.childNodes),
		length: names.length,
		names: names
	};
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

function updateImplicitNamspaces(platform) {
	switch(platform) {
		case 'android':
			break;
		case 'ios': 
			break;
		case 'mobileweb':
			CONST.IMPLICIT_NAMESPACES.NavigationGroup = 'Ti.UI.MobileWeb';
			break;
	}
}

exports.createCompileConfig = function(inputPath, outputPath, alloyConfig) {
	var dirs = ['assets','config','controllers','lib','migrations','models','styles','themes','vendor','views','widgets'];
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
	
	var config = exports.generateConfig(obj.dir.home, alloyConfig, obj.dir.resourcesAlloy);
	obj.theme = config.theme;

	// update implicit namespaces, if possible
	updateImplicitNamspaces(alloyConfig.platform);

	// keep a copy of the config for this module
	compilerConfig = obj;

	return obj;
};

exports.generateConfig = function(configDir, alloyConfig, resourceAlloyDir) {
	var cf = path.join(configDir,'config.'+CONST.FILE_EXT.CONFIG);
	var o = {};

	// parse config.json, if it exists
	if (path.existsSync(cf)) {
		try {
			var jf = fs.readFileSync(cf, 'utf8');
			var j = jsonlint.parse(jf);
		} catch (e) {
			U.die('Error processing "config.' + CONST.FILE_EXT.CONFIG + '"', e);
		}

		_.each(j, function(v,k) {
			if (!/^(?:env\:|os\:)/.test(k) && k !== 'global') {
				o[k] = v;
			} 
		});

		if (alloyConfig) {
			o = _.extend(o, j['global']);
			o = _.extend(o, j['env:'+alloyConfig.deploytype]);
			o = _.extend(o, j['os:'+alloyConfig.platform]);
		}
	} else {
		logger.warn('No "app/config.' + CONST.FILE_EXT.CONFIG + '" file found');
	}

	// write out the config runtime module
	wrench.mkdirSyncRecursive(resourceAlloyDir, 0777);
	fs.writeFileSync(
		path.join(resourceAlloyDir,'CFG.js'),
		"module.exports = " + JSON.stringify(o) + ";\n"
	);

	return o;
};

exports.loadController = function(file) {
	var code = {
		parentControllerName: '',
		controller: '',
		pre: ''
	};

	// Read the controller file
	try {
		if (!path.existsSync(file)) {
			return code;
		}
		var contents = fs.readFileSync(file,'utf8');
	} catch (e) {
		U.die('Error reading controller file "' + file + '".', e);
	}

    function checkAssigment() {
    	var target = this[2];
    	var value = this[3];
    	var match = pro.gen_code(target).match(/^exports\.(.+)/);

    	if (match !== null) {
            if (match[1] === 'baseController') {
    			code.parentControllerName = pro.gen_code(value);
    		} 		
    	}
    }

    function do_stat() {
    	if (this[1][0] === 'assign') {
    		return checkAssigment.call(this[1]);
    	}
    }

    // Manipulate the controller AST, finding the baseController 
    // assignment if present.
    try {
	    var ast = jsp.parse(contents);
		var walker = pro.ast_walker();
		var new_ast = walker.with_walkers({
			"stat": do_stat
		}, function(){
	        return walker.walk(ast);
	    });
	    code.controller = pro.gen_code(new_ast);
	} catch (e) {
		U.die('Error while processing the controller "' + file + '".', e);
	}

	return code;
};

exports.loadStyle = function(tssFile, manifest) {
	if (path.existsSync(tssFile)) {
		// read the style file
		try {
			var contents = fs.readFileSync(tssFile, 'utf8');
		} catch (e) {
			U.die('Failed to read style file "' + tssFile + '"', e);
		}

		// skip if the file is empty
		if (/^\s*$/gi.test(contents)) {
			return {};
		}

		// Add enclosing curly braces, if necessary
		contents = /^\s*\{[\s\S]+\}\s*$/gi.test(contents) ? contents : '{\n' + contents + '\n}';
			
		// Process tss file then convert to JSON
		try {
			var json = require('../../grammar/tss').parse(contents);
			optimizer.optimizeStyle(json);
		} catch (e) {
			U.die([
				'Error processing style "' + tssFile + '"',
				e.message,
				/Expected bare word\, comment\, end of line\, string or whitespace but ".+?" found\./.test(e.message) ? 'Do you have an extra comma in your style definition?' : '',
				'- line:    ' + e.line,
				'- column:  ' + e.column,
				'- offset:  ' + e.offset 
			]);
		}

		return json;
	}
	return {};
};

exports.loadAndSortStyle = function(tssFile, manifest) {
	return sortStyles(exports.loadStyle(tssFile, manifest));
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

exports.generateStyleParams = function(styles,classes,id,apiName,extraStyle,theState) {
	var platform = compilerConfig && compilerConfig.alloyConfig && compilerConfig.alloyConfig.platform ? compilerConfig.alloyConfig.platform : undefined;
	var regex = new RegExp('^' + STYLE_EXPR_PREFIX + '(.+)'),
		bindingRegex = /^\{(.+)\}$/,
		styleCollection = [],
		lastObj = {};

	_.each(styles, function(style) {
		var styleApi = style.key;
		if (style.isApi && styleApi.indexOf('.') === -1) {
			var ns = (CONST.IMPLICIT_NAMESPACES[styleApi] || CONST.NAMESPACE_DEFAULT);
			styleApi = ns + '.' + styleApi;
		}

		if ((style.isId && style.key === id) ||
			(style.isClass && _.contains(classes, style.key)) ||
			(style.isApi && styleApi === apiName)) {
			
			// manage potential runtime conditions for the style
			var conditionals = {
				platform: [],
				formFactor: ''
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

				// handle formFactor device query
				if (q.formFactor === 'tablet') {
					conditionals.formFactor = 'Alloy.isTablet';
				} else if (q.formFactor === 'handheld') {
					conditionals.formFactor = 'Alloy.isHandheld';
				}

				// assemble runtime query
				var pcond = conditionals.platform.length > 0 ? '(' + conditionals.platform.join(' || ') + ')' : '';
				var joinString = pcond && conditionals.formFactor ? ' && ' : '';
				var conditional = pcond + joinString + conditionals.formFactor;

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

	// substitutions for binding
	_.each(styleCollection, function(style) {
		_.each(style.style, function(v,k) {
			if (_.isString(v)) {
				var match = v.match(bindingRegex);
				if (match !== null) {
					var parts = match[1].split('.');

					// model binding
					if (parts.length > 1) {
						// are we bound to a global or controller-specific model?
						var modelVar = parts[0] === '$' ? parts[0] + '.' + parts[1] : 'Alloy.Models.' + parts[0];
						var attr = parts[0] === '$' ? parts[2] : parts[1];

						// ensure that the bindings for this model have been initialized
						if (!_.isArray(exports.bindingsMap[modelVar])) {
							exports.bindingsMap[modelVar] = [];
						}

						// create the binding object
						var bindingObj = {
							id: id,
							prop: k,
							attr: attr
						};

						// make sure bindings are wrapped in any conditionals
						// relevant to the curent style
						if (theState.condition) {
							bindingObj.condition = theState.condition;
						}

						// add this property to the global bindings map for the 
						// current controller component
						exports.bindingsMap[modelVar].push(bindingObj);

						// since this property is data bound, don't include it in 
						// the style statically
						delete style.style[k];
					} 
					// collection binding
					else {
						var modelVar = theState && theState.model ? theState.model : CONST.BIND_MODEL_VAR;
						var transform = modelVar + "." + CONST.BIND_TRANSFORM_VAR + "['" + match[1] + "']";
						var standard = modelVar + ".get('" + match[1] + "')";
						var modelCheck = "typeof " + transform + " !== 'undefined' ? " + transform + " : " + standard; 
						style.style[k] = STYLE_EXPR_PREFIX + modelCheck;
					}
				}
			}
		});
	});

	function processStyle(style, fromArray) {
		style = fromArray ? {0:style} : style;
		for (var sn in style) {
			var value = style[sn],
				prefix = fromArray ? '' : sn + ':',
				actualValue;

			if (_.isString(value)) {
				var matches = value.match(regex);
				if (matches !== null) {
					code += prefix + matches[1] + ','; // matched a JS expression
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

	var opts = {
		mangle: {
			mangle: false,                    // Mangle any names?
			no_functions: true,               // Don't mangle functions?
			toplevel: false,                  // Mangle toplevel names?
			defines: defines,                 // A list of definitions to process
			except: ['Ti','Titanium','Alloy'] // A list of names to leave untouched
		},
		squeeze: {
            make_seqs   : false,  // Make sequences out of multiple statements?
            dead_code   : true,   // Remove dead code?
            no_warnings : true,   // Don't print squeeze warning?
            keep_comps  : true,   // Don't try to optimize comparison operators? (unsafe)
            unsafe      : false   // Alloy potentially unsafe optimizations?
        },
        gen_code: {
            indent_start : 0,     // Base indentation for lines
            indent_level : 4,     // Indentation increment for nested lines
            quote_keys   : false, // Quote keys in objects?
            space_colon  : false, // Put a space between keys and colons?
            beautify     : true,  // Beautify the generated code?
            ascii_only   : false, // Process only ascii characters
            inline_script: false, // Compress <script> tags?
            double_quotes: true,  // Always use double quotes to contain strings (necessary for JSON processing)
            ignore_numbers: true  // Don't try to compress numbers
        }
	}

	ast = pro.ast_mangle(ast, opts.mangle);

	// TODO: re-enable when complete -> https://jira.appcelerator.org/browse/ALOY-273
	// ast = optimizer.optimize(ast, DEFINES, fn); // optimize our titanium based code

	ast = pro.ast_squeeze(ast, opts.squeeze);
	return pro.gen_code(ast, opts.gen_code);
};

///////////////////////////////////////
////////// private functions //////////
///////////////////////////////////////
function sortStyles(componentStyle) {
	var mergedStyle = {},
		regex = /^\s*([\#\.]{0,1})([^\[]+)(?:\[([^\]]+)\])*\s*$/,
		extraStyle = extraStyle || {},
		sortedStyles = [],
		ctr = 1,
		VALUES = {
			ID:     100000,
			CLASS:   10000,
			API:      1000,
			PLATFORM:  100,
			FORMFACTOR: 10,
			SUM:         1,
			ORDER:       0.001
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
					} else if (q === 'formFactor') {
						priority += VALUES.FORMFACTOR + VALUES.SUM;
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

exports.validateNodeName = function(node, names) {
	var fullname = exports.getNodeFullname(node);
	var ret = null;
	_.isArray(names) || (names = [names]);

	// Is the node name in the given list of valid names?
	ret = _.find(names, function(name) { return name === fullname });
	if (ret) { return ret; }

	// Is it an Alloy.Require?
	if (fullname === 'Alloy.Require') {
		var inspect = exports.inspectRequireNode(node);
		ret = _.find(names, function(name) { return inspect.names[0] === name });
		if (inspect.length === 1 && ret) { 
			return ret;
		}
	}

	return null;
};

exports.generateCollectionBindingTemplate = function(args) {
	var code = '';

	// Determine the collection variable to use
	var obj = { name: args[CONST.BIND_COLLECTION] };
	var col = _.template("Alloy.Collections['<%= name %>'] || <%= name %>", obj);
	var colVar = exports.generateUniqueId();

	// Create the code for the filter and transform functions
	var where = args[CONST.BIND_WHERE];
	var transform = args[CONST.BIND_TRANSFORM];
	var whereCode = where ? where + "(" + colVar + ")" : colVar + ".models";
	var transformCode = transform ? transform + "(<%= localModel %>)" : "{}";
	var handlerFunc = args[CONST.BIND_FUNCTION] || exports.generateUniqueId();

	// construct code template
	code += "var " + colVar + "=" + col + ";";
	code += "function " + handlerFunc + "(e) {";
	code += "	var models = " + whereCode + ";";
	code += "	var len = models.length;";
	code += "<%= pre %>";
	code += "	for (var i = 0; i < len; i++) {";
	code += "		var <%= localModel %> = models[i];";
	code += "		<%= localModel %>.__transform = " + transformCode + ";";
	code += "<%= items %>";
	code += "	}";
	code += "<%= post %>";
	code += "};";
	code += colVar + ".on('" + CONST.COLLECTION_BINDING_EVENTS + "'," + handlerFunc + ");";

	exports.destroyCode += colVar + ".off('" + CONST.COLLECTION_BINDING_EVENTS + "'," + handlerFunc + ");";

	return code;
};
