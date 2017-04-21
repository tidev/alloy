var fs = require('fs'),
	path = require('path'),
	colors = require('colors'),
	TU = require('../lib/testUtils'),
	CONST = require('../../Alloy/common/constants'),
	_ = require('../../Alloy/lib/alloy/underscore')._,
	babylon = require('babylon'),
	babel = require('babel-core');

var tests = [
	// make sure we didn't break normal conditionals and assigments
	['var a = Ti.Platform.name', 'var a="<%= name %>"'],
	['var a = Titanium.Platform.name', 'var a="<%= name %>"'],
	['var a = Ti.Platform.name=="<%= name %>" ? 1 : 0', 'var a=1'],
	['var a = Ti.Platform.name=="<%= name %>", b', 'var b,a=!0'],
	['var a = Ti.Platform.name=="<%= name %>", b, c = 2', 'var b,a=!0,c=2'],
	['var a = Ti.Platform.name=="<%= name %>"', 'var a=!0'],
	['var a = Ti.Platform.name!="iPhone OS"', 'var a=!1', ['ios']],
	['var a = Ti.Platform.name=="iPhone OS"', 'var a=!1', notPlatform('ios')],
	['var a, b = Ti.Platform.name=="<%= name %>", c = 2;', 'var a,b=!0,c=2'],
	['var a = "<%= name %>"==Ti.Platform.name ? 1 : 0', 'var a=1'],
	['var a = "<%= name %>"==Ti.Platform.name, b', 'var b,a=!0'],
	['var a = "<%= name %>"==Ti.Platform.name, b, c = 2', 'var b,a=!0,c=2'],
	['var a = "<%= name %>"==Ti.Platform.name', 'var a=!0'],
	['var a = "iPhone OS"!=Ti.Platform.name', 'var a=!1', ['ios']],
	['var a = "iPhone OS"==Ti.Platform.name', 'var a=!1', notPlatform('ios')],
	['var a, b = "<%= name %>"==Ti.Platform.name, c = 2;', 'var a,b=!0,c=2'],
	['var a = "1"', 'var a="1"'],
	['var a = true', 'var a=!0'],
	['var a = 1', 'var a=1'],
	['var a', 'var a'],
	['var a = {}', 'var a={}'],
	['var a = new Object', 'var a={}'],
	['var a = new Object()', 'var a={}'],
	['var a = Ti.Platform.name', 'var a="<%= name %>"'],
	['var a = Ti.Platform.osname', 'var a="android"', ['android']],
	['var a = Ti.Platform.osname', 'var a="mobileweb"', ['mobileweb']],
	['var a = Ti.Platform.osname', 'var a="blackberry"', ['blackberry']],
	['var a, b = 1, c = 2;', 'var a,b=1,c=2'],
	['var a = 1;', 'var a=1'],
	['var a =+1;', 'var a=1'],
	['var a =1+1;', 'var a=2'],
	['var a = 1.0;', 'var a=1'],
	['var a = 1.02;', 'var a=1.02'],
	['var a = -1.02;', 'var a=-1.02'],
	['var a = false', 'var a=!1'],
	['var a = true ? 1 : 0;', 'var a=1'],
	["var num = isNaN(amount) || amount === '' || amount === null ? 0.00 : amount;", 'var num=isNaN(amount)||""===amount||null===amount?0:amount'],

	// TODO: Revisit all "var a,a=2;" expecteds once ALOY-540 is resolved

	// make sure we didn't break normal if conditions
	['if (true) { var a = 1; } else { var a = 2; }', "var a=1,a"],

	// check platform conditionals (if/else)
	["if (Titanium.Platform.name === '<%= name %>'){ var a = 1; } else { var a = 2; }","var a=1,a"],
	["if (Titanium.Platform.name !== '<%= name %>'){ var a = 1; } else { var a = 2; }","var a=2,a"],
	["if (Titanium.Platform['name'] == '<%= name %>'){ var a = 1; } else { var a = 2; }","var a=1,a"],
	["if (Titanium.Platform.name !== '<%= name %>'){ var a = 1; } else { var a = 2; }","var a=2,a"],
	["if (Titanium.Platform['name'] !== '<%= name %>'){ var a = 1; } else { var a = 2; }","var a=2,a"],

	// check platform conditional assignments
	["var platform = Ti.Platform['name'] === '<%= name %>'", "var platform=!0"],
	["var platform = Ti.Platform[\"name\"] === '<%= name %>'", "var platform=!0"],
	["var platform = Ti.Platform.name === '<%= name %>'", "var platform=!0"],
	["var platform = Ti.Platform.name === 'iPhone OS'", "var platform=!1", notPlatform('ios')],
	["var platform = (Ti.Platform.name === '<%= name %>')", "var platform=!0"],
	["var platform = (Ti.Platform.name === '<%= name %>') ? 1 : 0", "var platform=1"],
	["var platform = (Ti.Platform.name === '<%= name %>') ? true : false", "var platform=!0"],
	["var platform = (Ti.Platform.name === 'iPhone OS') ? 1 : 0", "var platform=0", notPlatform('ios')],
	["var platform = (Ti.Platform.name === 'iPhone OS') ? true : false", "var platform=!1", notPlatform('ios')],
	["var platform = (Ti.Platform.name == '<%= name %>') ? 'true' : 'false'", "var platform=\"true\""],
	["var platform = (Ti.Platform.name == 'iPhone OS') ? 'true' : 'false'", "var platform=\"false\"", notPlatform('ios')],
	["var platform = (Ti.Platform.osname == 'android') ? 'true' : 'false'", "var platform=\"true\"", ['android']],
	["var platform = (Ti.Platform.osname == \"iphone\") ? 1 : 0", "var platform=0", notPlatform('ios')],
	["var platform = (Ti.Platform.osname == \"iphone\") ? 1 : 0", "var platform=\"iphone\"==Ti.Platform.osname?1:0", ['ios']],

	// check identities
	["var a = Ti.Platform.name === Titanium.Platform.name","var a=!0"],

	// shouldn't attempt to process anything other than strings
	["if (Ti.Platform.name === couldBeAnything()) { var a = 1; } else { var a = 2; }","if(\"<%= name %>\"===couldBeAnything())var a=1;else var a=2"],
	["if (Ti.Platform.name === some.Other.Value) { var a = 1; } else { var a = 2; }","if(\"<%= name %>\"===some.Other.Value)var a=1;else var a=2"],
	["if (Ti.Platform.name !== aVariable) { var a = 1; } else { var a = 2; }","if(\"<%= name %>\"!==aVariable)var a=1;else var a=2"],

	// properly handles conditionals without curly braces
	["if (Ti.Platform.name === '<%= name %>') var a = 1; else var a = 2;","var a=1,a"],
	["if (Ti.Platform.name !== '<%= name %>') var a = 1; else var a = 2;","var a=2,a"],
	["if ('<%= name %>' === Ti.Platform.name) var a = 1; else var a = 2;","var a=1,a"],
	["if ('<%= name %>' !== Ti.Platform.name) var a = 1; else var a = 2;","var a=2,a"],

	// works if Ti.Platform.* is on the left or right hand side
	["if ('<%= name %>' === Ti.Platform.name) { var a = 1; } else { a = 2; }","var a=1"]
];

// Prepare each platform with values we can swap out at compile time.
// This means less walks over the native bridge, which means better performance.
var platforms = {};
var platformsDir = path.join(__dirname,'..','..','platforms');
_.each(CONST.PLATFORMS, function(p) {
	platforms[p] = require(path.join(platformsDir,p,'index'));
});

// The alloy command test suite
describe('optimizer.js', function() {
	_.each(tests, function(test, index) {
		describe('test #' + (index+1), function() {
			_.each(platforms, function(platformObj, platform) {
				describe('[' + platform + ']', function() {
					var ast, code,
						testContent = _.template(test[0], platforms[platform]),
						prefix = pad(platform);

					it(prefix + testContent.blue, function() {
						expect(true).toBe(true);
					});

					it(prefix + 'parses AST with babylon', function() {
						var parseFunction = function() {
							ast = babylon.parse(testContent);
						};
						expect(parseFunction).not.toThrow();
					});

					it(prefix + 'optimizes code via Babel and our custom plugins', function() {
						// execute the squeeze to remove dead code, always performed
						// as the last step of JS file processing. The unit testing here
						// uses the same settings as the Alloy compile process.
						var squeezeFunction = function() {
							var options = {minified: true, compact: false, comments: false, presets: ['babili'], plugins: [['./Alloy/commands/compile/ast/optimizer-plugin', {platform: platform}]]};
							var result = babel.transformFromAst(ast, null, options);
							ast = result.ast;
							code = result.code.replace(/\s*$/,'');
						};
						expect(squeezeFunction).not.toThrow();
					});

					it(prefix + 'generated code matches expected code', function() {
						var passFor = test[2];
						var expected = _.template(test[1], platforms[platform]) + ';';

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
