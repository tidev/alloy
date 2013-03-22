var fs = require('fs'),
	path = require('path'),
	colors = require('colors'),
	TU = require('../lib/testUtils'),
	CONST = require('../../Alloy/common/constants'),
	_ = require('../../Alloy/lib/alloy/underscore')._,
	uglifyjs = require('uglify-js'),
	optimizer = require('../../Alloy/commands/compile/optimizer');

var tests = [
	// make sure we didn't break normal conditionals and assigments
	['var a = Ti.Platform.name', 'var a="<%= Ti_Platform_name %>"'],
	['var a = Titanium.Platform.name', 'var a="<%= Titanium_Platform_name %>"'],
	['var a = Ti.Platform.name=="<%= Titanium_Platform_name %>" ? 1 : 0', 'var a=1'],
	['var a = Ti.Platform.name=="<%= Titanium_Platform_name %>", b', 'var a=true,b'],
	['var a = Ti.Platform.name=="<%= Titanium_Platform_name %>", b, c = 2', 'var a=true,b,c=2'],
	['var a = Ti.Platform.name=="<%= Titanium_Platform_name %>"', 'var a=true'],
	['var a = Ti.Platform.name!="iPhone OS"', 'var a=false', ['ios']],
	['var a = Ti.Platform.name=="iPhone OS"', 'var a=false', notPlatform('ios')],
	['var a, b = Ti.Platform.name=="<%= Titanium_Platform_name %>", c = 2;', 'var a,b=true,c=2'],
	['var a = "<%= Titanium_Platform_name %>"==Ti.Platform.name ? 1 : 0', 'var a=1'],
	['var a = "<%= Titanium_Platform_name %>"==Ti.Platform.name, b', 'var a=true,b'],
	['var a = "<%= Titanium_Platform_name %>"==Ti.Platform.name, b, c = 2', 'var a=true,b,c=2'],
	['var a = "<%= Titanium_Platform_name %>"==Ti.Platform.name', 'var a=true'],
	['var a = "iPhone OS"!=Ti.Platform.name', 'var a=false', ['ios']],
	['var a = "iPhone OS"==Ti.Platform.name', 'var a=false', notPlatform('ios')],
	['var a, b = "<%= Titanium_Platform_name %>"==Ti.Platform.name, c = 2;', 'var a,b=true,c=2'],
	['var a = "1"', 'var a="1"'],
	['var a = true', 'var a=true'],
	['var a = 1', 'var a=1'],
	['var a', 'var a'],
	['var a = {}', 'var a={}'],
	['var a = new Object', 'var a=new Object'],
	['var a = new Object()', 'var a=new Object'],
	['var a = Ti.Platform.name', 'var a="<%= Ti_Platform_name %>"'],
	['var a = Ti.Platform.osname', 'var a="android"', ['android']],
	['var a = Ti.Platform.osname', 'var a="mobileweb"', ['mobileweb']],
	['var a, b = 1, c = 2;', 'var a,b=1,c=2'],
	['var a = 1;', 'var a=1'],
	['var a =+1;', 'var a=1'],
	['var a =1+1;', 'var a=2'],
	['var a = 1.0;', 'var a=1'],
	['var a = 1.02;', 'var a=1.02'],
	['var a = -1.02;', 'var a=-1.02'],
	['var a = false', 'var a=false'],
	['var a = true ? 1 : 0;', 'var a=1'],
	["var num = isNaN(amount) || amount === '' || amount === null ? 0.00 : amount;", 'var num=isNaN(amount)||""===amount||null===amount?0:amount'],

	// TODO: Revisit all "var a,a=2;" expecteds once ALOY-540 is resolved

	// make sure we didn't break normal if conditions
	['if (true) { var a = 1; } else { var a = 2; }', "var a,a=1"],

	// check platform conditionals (if/else)
	["if (Titanium.Platform.name === '<%= Titanium_Platform_name %>'){ var a = 1; } else { var a = 2; }","var a,a=1"],
	["if (Titanium.Platform.name !== '<%= Titanium_Platform_name %>'){ var a = 1; } else { var a = 2; }","var a,a=2"],
	["if (Titanium.Platform['name'] == '<%= Titanium_Platform_name %>'){ var a = 1; } else { var a = 2; }","var a,a=1"],
	["if (Titanium.Platform.name !== '<%= Titanium_Platform_name %>'){ var a = 1; } else { var a = 2; }","var a,a=2"],
	["if (Titanium.Platform['name'] !== '<%= Titanium_Platform_name %>'){ var a = 1; } else { var a = 2; }","var a,a=2"],

	// check platform conditional assignments
	["var platform = Ti.Platform['name'] === '<%= Ti_Platform_name %>'", "var platform=true"],
	["var platform = Ti.Platform[\"name\"] === '<%= Ti_Platform_name %>'", "var platform=true"],
	["var platform = Ti.Platform.name === '<%= Ti_Platform_name %>'", "var platform=true"],
	["var platform = Ti.Platform.name === 'iPhone OS'", "var platform=false", notPlatform('ios')],
	["var platform = (Ti.Platform.name === '<%= Ti_Platform_name %>')", "var platform=true"],
	["var platform = (Ti.Platform.name === '<%= Ti_Platform_name %>') ? 1 : 0", "var platform=1"],
	["var platform = (Ti.Platform.name === '<%= Ti_Platform_name %>') ? true : false", "var platform=true"],
	["var platform = (Ti.Platform.name === 'iPhone OS') ? 1 : 0", "var platform=0", notPlatform('ios')],
	["var platform = (Ti.Platform.name === 'iPhone OS') ? true : false", "var platform=false", notPlatform('ios')],
	["var platform = (Ti.Platform.name == '<%= Ti_Platform_name %>') ? 'true' : 'false'", "var platform=\"true\""],
	["var platform = (Ti.Platform.name == 'iPhone OS') ? 'true' : 'false'", "var platform=\"false\"", notPlatform('ios')],
	["var platform = (Ti.Platform.osname == 'android') ? 'true' : 'false'", "var platform=\"true\"", ['android']],
	["var platform = (Ti.Platform.osname == \"iphone\") ? 1 : 0", "var platform=0", notPlatform('ios')],
	["var platform = (Ti.Platform.osname == \"iphone\") ? 1 : 0", "var platform=\"iphone\"==Ti.Platform.osname?1:0", ['ios']],

	// check identities
	["var a = Ti.Platform.name === Titanium.Platform.name","var a=true"],

	// shouldn't attempt to process anything other than strings
	["if (Ti.Platform.name === couldBeAnything()) { var a = 1; } else { var a = 2; }","if(\"<%= Ti_Platform_name %>\"===couldBeAnything())var a=1\nelse var a=2"],
	["if (Ti.Platform.name === some.Other.Value) { var a = 1; } else { var a = 2; }","if(\"<%= Ti_Platform_name %>\"===some.Other.Value)var a=1\nelse var a=2"],
	["if (Ti.Platform.name !== aVariable) { var a = 1; } else { var a = 2; }","if(\"<%= Ti_Platform_name %>\"!==aVariable)var a=1\nelse var a=2"],

	// properly handles conditionals without curly braces
	["if (Ti.Platform.name === '<%= Ti_Platform_name %>') var a = 1; else var a = 2;","var a,a=1"],
	["if (Ti.Platform.name !== '<%= Ti_Platform_name %>') var a = 1; else var a = 2;","var a,a=2"],
	["if ('<%= Ti_Platform_name %>' === Ti.Platform.name) var a = 1; else var a = 2;","var a,a=1"],
	["if ('<%= Ti_Platform_name %>' !== Ti.Platform.name) var a = 1; else var a = 2;","var a,a=2"],

	// works if Ti.Platform.* is on the left or right hand side 
	["if ('<%= Ti_Platform_name %>' === Ti.Platform.name) { var a = 1; } else { a = 2; }","var a=1"],
];

// Prepare each platform with values we can swap out at compile time.
// This means less walks over the native bridge, which means better performance.
// Using underscores in the key names since underscore template()
// chokes when there's periods in the key name.
var platforms = {
	android: {
		'Ti_Platform_name': 'android',
		'Ti_Platform_osname': 'android'
	},
	ios: {
		'Ti_Platform_name': 'iPhone OS',
		'Ti_Platform_osname': ['ipad','iphone']
	},
	mobileweb: {
		'Ti_Platform_name': 'mobileweb',
		'Ti_Platform_osname': 'mobileweb'
	}
};
_.each(platforms, function(obj,p) {
	_.each(obj, function(v,k) {
		platforms[p][k.replace('Ti_','Titanium_')] = v;
	});
});

// The alloy command test suite
describe('optimizer.js', function() {
	_.each(tests, function(test, index) {
		describe('test #' + (index+1), function() {
			_.each(platforms, function(platformObj, platform) {
				describe('[' + platform + ']', function() {
					var ast, code, 
						testContent = _.template(test[0], platforms[platform]),
						prefix = pad(platform),
						defines = {
							OS_ANDROID: platform === 'android',
							OS_IOS: platform === 'ios',
							OS_MOBILEWEB: platform === 'mobileweb'
						};

					it(prefix + testContent.blue, function() {
						expect(true).toBe(true);
					});

					it(prefix + 'parses AST with uglifyjs', function() {
						var parseFunction = function() {
							ast = uglifyjs.parse(testContent);
						};
						expect(parseFunction).not.toThrow();
					});
					
					it(prefix + 'optimizes AST via optimizer.js', function() {
						var optimizeFunction = function() {
							ast.figure_out_scope();
							ast = optimizer.optimize(ast, defines);
						};
						expect(optimizeFunction).not.toThrow();
					});

					it(prefix + 'ast_squeeze', function() {
						// execute the squeeze to remove dead code, always performed
						// as the last step of JS file processing. The unit testing here
						// uses the same settings as the Alloy compile process.
						var squeezeFunction = function() {
							var options = {
								sequences     : true,  // join consecutive statemets with the “comma operator”
								properties    : false,   // optimize property access: a["foo"] → a.foo
								dead_code     : true,   // discard unreachable code
								drop_debugger : false,   // discard “debugger” statements
								unsafe        : false,   // some unsafe optimizations (see below)
								conditionals  : true,   // optimize if-s and conditional expressions
								comparisons   : true,   // optimize comparisons
								evaluate      : true,   // evaluate constant expressions
								booleans      : false,   // optimize boolean expressions
								loops         : false,   // optimize loops
								unused        : true,   // drop unused variables/functions
								hoist_funs    : true,   // hoist function declarations
								hoist_vars    : false,  // hoist variable declarations
								if_return     : true,   // optimize if-s followed by return/continue
								join_vars     : true,   // join var declarations
								cascade       : true,   // try to cascade `right` into `left` in sequences
								side_effects  : true,   // drop side-effect-free statements
								warnings      : false,   // warn about potentially dangerous optimizations/code
								global_defs   : defines      // global definitions
							};

							ast.figure_out_scope();
							ast = ast.transform(uglifyjs.Compressor(options));
						};
						expect(squeezeFunction).not.toThrow();
					});

					it(prefix + 'generates code from optimized AST via uglifyjs', function() {
						var generateFunction = function() {
							var stream = uglifyjs.OutputStream({
								beautify: false,
								semicolons: false,
								bracketize: false
							});
							ast.print(stream);
							code = stream.toString().replace(/\s*$/,'');
						};
						expect(generateFunction).not.toThrow();
					});

					it(prefix + 'generated code matches expected code', function() {
						var passFor = test[2];
						var expected = _.template(test[1], platforms[platform]);

						if (!passFor || _.contains(passFor, platform)) {
							expect(code).toBe(expected);
						} else {
							expect(code).not.toBe(expected);
						}
					});
				});
			});
		});
	});
});

// helper functions
function notPlatform(platform) {
	return _.reject(CONST.PLATFORMS, function(p) { return p === platform; } );
}

function pad(string) {
	var ret = '';
	for (var i = 0; i < 10 - string.length; i++) {
		ret += ' ';
	}
	return ret;
}


