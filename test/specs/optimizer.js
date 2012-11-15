var fs = require('fs'),
	path = require('path'),
	colors = require('colors'),
	TU = require('../lib/testUtils'),
	CONST = require('../../Alloy/common/constants'),
	_ = require('../../Alloy/lib/alloy/underscore')._,
	jsp = require("../../Alloy/uglify-js/uglify-js").parser,
	pro = require("../../Alloy/uglify-js/uglify-js").uglify,
	optimizer = require('../../Alloy/commands/compile/optimizer');

var tests = [
	// make sure we didn't break normal conditionals and assigments
	['var a = Ti.Platform.name', 'var a="<%= Ti_Platform_name %>"'],
	['var a = Titanium.Platform.name', 'var a="<%= Titanium_Platform_name %>"'],
	['var a = Ti.Platform.name=="<%= Titanium_Platform_name %>" ? 1 : 0', 'var a=1'],
	['var a = Ti.Platform.name=="<%= Titanium_Platform_name %>", b', 'var a=!0,b'],
	['var a = Ti.Platform.name=="<%= Titanium_Platform_name %>", b, c = 2', 'var a=!0,b,c=2'],
	['var a = Ti.Platform.name=="<%= Titanium_Platform_name %>"', 'var a=!0'],
	['var a = Ti.Platform.name!="iPhone OS"', 'var a=!1', ['ios']],
	['var a = Ti.Platform.name=="iPhone OS"', 'var a=!1', notPlatform('ios')],
	['var a, b = Ti.Platform.name=="<%= Titanium_Platform_name %>", c = 2;', 'var a,b=!0,c=2'],
	['var a = "<%= Titanium_Platform_name %>"==Ti.Platform.name ? 1 : 0', 'var a=1'],
	['var a = "<%= Titanium_Platform_name %>"==Ti.Platform.name, b', 'var a=!0,b'],
	['var a = "<%= Titanium_Platform_name %>"==Ti.Platform.name, b, c = 2', 'var a=!0,b,c=2'],
	['var a = "<%= Titanium_Platform_name %>"==Ti.Platform.name', 'var a=!0'],
	['var a = "iPhone OS"!=Ti.Platform.name', 'var a=!1', ['ios']],
	['var a = "iPhone OS"==Ti.Platform.name', 'var a=!1', notPlatform('ios')],
	['var a, b = "<%= Titanium_Platform_name %>"==Ti.Platform.name, c = 2;', 'var a,b=!0,c=2'],
	['var a = "1"', 'var a="1"'],
	['var a = true', 'var a=!0'],
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
	['var a = !1', 'var a=!1'],
	['var a = true ? 1 : 0;', 'var a=1'],
	["var num = isNaN(amount) || amount === '' || amount === null ? 0.00 : amount;", 'var num=isNaN(amount)||amount===""||amount===null?0:amount'],

	// make sure we didn't break normal if conditions
	['if (true) { var a = 1; } else { var a = 2; }', "var a=1"],

	// check platform conditionals (if/else)
	["if (Titanium.Platform.name === '<%= Titanium_Platform_name %>'){ var a = 1; } else { var a = 2; }","var a=1"],
	["if (Titanium.Platform.name !== '<%= Titanium_Platform_name %>'){ var a = 1; } else { var a = 2; }","var a=2"],
	["if (Titanium.Platform['name'] == '<%= Titanium_Platform_name %>'){ var a = 1; } else { var a = 2; }","var a=1"],
	["if (Titanium.Platform.name !== '<%= Titanium_Platform_name %>'){ var a = 1; } else { var a = 2; }","var a=2"],
	["if (Titanium.Platform['name'] !== '<%= Titanium_Platform_name %>'){ var a = 1; } else { var a = 2; }","var a=2"],

	// check platform conditional assignments
	["var platform = Ti.Platform['name'] === '<%= Ti_Platform_name %>'", "var platform=!0"],
	["var platform = Ti.Platform[\"name\"] === '<%= Ti_Platform_name %>'", "var platform=!0"],
	["var platform = Ti.Platform.name === '<%= Ti_Platform_name %>'", "var platform=!0"],
	["var platform = Ti.Platform.name === 'iPhone OS'", "var platform=!1", notPlatform('ios')],
	["var platform = (Ti.Platform.name === '<%= Ti_Platform_name %>')", "var platform=!0"],
	["var platform = (Ti.Platform.name === '<%= Ti_Platform_name %>') ? 1 : 0", "var platform=1"],
	["var platform = (Ti.Platform.name === '<%= Ti_Platform_name %>') ? true : false", "var platform=!0"],
	["var platform = (Ti.Platform.name === 'iPhone OS') ? 1 : 0", "var platform=0", notPlatform('ios')],
	["var platform = (Ti.Platform.name === 'iPhone OS') ? true : false", "var platform=!1", notPlatform('ios')],
	["var platform = (Ti.Platform.name == '<%= Ti_Platform_name %>') ? 'true' : 'false'", "var platform=\"true\""],
	["var platform = (Ti.Platform.name == 'iPhone OS') ? 'true' : 'false'", "var platform=\"false\"", notPlatform('ios')],
	["var platform = (Ti.Platform.osname == 'android') ? 'true' : 'false'", "var platform=\"true\"", ['android']],
	["var platform = (Ti.Platform.osname == \"iphone\") ? 1 : 0", "var platform=0", notPlatform('ios')],
	["var platform = (Ti.Platform.osname == \"iphone\") ? 1 : 0", "var platform=Ti.Platform.osname==\"iphone\"?1:0", ['ios']],

	// check identities
	["var a = Ti.Platform.name === Titanium.Platform.name","var a=!0"],

	// shouldn't attempt to process anything other than strings
	["if (Ti.Platform.name === couldBeAnything()) { var a = 1; } else { var a = 2; }","if(\"<%= Ti_Platform_name %>\"===couldBeAnything())var a=1;else var a=2"],
	["if (Ti.Platform.name === some.Other.Value) { var a = 1; } else { var a = 2; }","if(\"<%= Ti_Platform_name %>\"===some.Other.Value)var a=1;else var a=2"],
	["if (Ti.Platform.name !== aVariable) { var a = 1; } else { var a = 2; }","if(\"<%= Ti_Platform_name %>\"!==aVariable)var a=1;else var a=2"],

	// properly handles conditionals without curly braces
	["if (Ti.Platform.name === '<%= Ti_Platform_name %>') var a = 1; else var a = 2;","var a=1"],
	["if (Ti.Platform.name !== '<%= Ti_Platform_name %>') var a = 1; else var a = 2;","var a=2"],
	["if ('<%= Ti_Platform_name %>' === Ti.Platform.name) var a = 1; else var a = 2;","var a=1"],
	["if ('<%= Ti_Platform_name %>' !== Ti.Platform.name) var a = 1; else var a = 2;","var a=2"],

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
							ast = jsp.parse(testContent);
						};
						expect(parseFunction).not.toThrow();
					});
					
					it(prefix + 'optimizes AST via optimizer.js', function() {
						var optimizeFunction = function() {
							ast = optimizer.optimize(ast, defines);
						};
						expect(optimizeFunction).not.toThrow();
					});

					it(prefix + 'ast_squeeze', function() {
						// execute the squeeze to remove dead code, always performed
						// as the last step of JS file processing. The unit testing here
						// uses the same settings as the Alloy compile process.
						var squeezeFunction = function() {
							ast = pro.ast_squeeze(ast, {
								make_seqs   : false,  
						        dead_code   : true,   
						        no_warnings : true,   
						        keep_comps  : true,   
						        unsafe      : false 
							});
						};
						expect(squeezeFunction).not.toThrow();
					});

					it(prefix + 'generates code from optimized AST via uglifyjs', function() {
						var generateFunction = function() {
							code = pro.gen_code(ast, {beautify:false}); 
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


