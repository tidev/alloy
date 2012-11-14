var fs = require('fs'),
	path = require('path'),
	TU = require('../lib/testUtils'),
	CONST = require('../../Alloy/common/constants'),
	_ = require('../../Alloy/lib/alloy/underscore')._,
	jsp = require("../../Alloy/uglify-js/uglify-js").parser,
	pro = require("../../Alloy/uglify-js/uglify-js").uglify,
	optimizer = require('../../Alloy/commands/compile/optimizer');

var tests = [
	['var a = Ti.Platform.name', 'var a="<%= Ti_Platform_name %>"'],
	['var a = Titanium.Platform.name', 'var a="<%= Titanium_Platform_name %>"'],
	['var a = Ti.Platform.name=="<%= Titanium_Platform_name %>" ? 1 : 0', 'var a=1'],
	['var a = Ti.Platform.name=="<%= Titanium_Platform_name %>", b', 'var a=1,b'],
	['var a = Ti.Platform.name=="<%= Titanium_Platform_name %>", b, c = 2', 'var a=1,b,c=2'],
	['var a = Ti.Platform.name=="<%= Titanium_Platform_name %>"', 'var a=1'],
	//['var a = Ti.Platform.name!="iPhone OS"', 'var a=1', androidDefines],
	//['var a = Ti.Platform.name=="iPhone OS"', 'var a=0', androidDefines],
];

/*
var tests = 
[
	// make sure we didn't break normal conditionals and assigments
	['var a = Ti.Platform.name', 'var a="iPhone OS"', ['ios']],
	['var a = Ti.Platform.name', 'var a="android"', ['android']],
	['var a = Ti.Platform.name=="iPhone OS" ? 1 : 0', 'var a=1', ['ios']],
	['var a = Ti.Platform.name=="iPhone OS", b', 'var a=1,b', iosDefines],
	['var a = Ti.Platform.name=="iPhone OS", b, c = 2', 'var a=1,b,c=2', iosDefines],
	['var a = Ti.Platform.name=="iPhone OS"', 'var a=1', iosDefines],
	['var a = Ti.Platform.name!="iPhone OS"', 'var a=1', androidDefines],
	['var a = Ti.Platform.name=="iPhone OS"', 'var a=0', androidDefines],
	['var a, b = Ti.Platform.name=="iPhone OS", c = 2;', 'var a,b=1,c=2', iosDefines],
	['var a = "1"', 'var a="1"', iosDefines],
	['var a = true', 'var a=true', iosDefines],
	['var a = 1', 'var a=1', iosDefines],
	['var a', 'var a', iosDefines],
	['var a = {}', 'var a={}', iosDefines],
	['var a = new Object', 'var a=new Object', iosDefines],
	['var a = new Object()', 'var a=new Object', iosDefines],
	['var a = Ti.Platform.name', 'var a="iPhone OS"', iosDefines],
	['var a = Ti.Platform.osname', 'var a="android"', androidDefines],
	['var a, b = 1, c = 2;', 'var a,b=1,c=2', iosDefines],
	['var a = 1;', 'var a=1', iosDefines],
	['var a =+1;', 'var a=+1', iosDefines],
	['var a =1+1;', 'var a=1+1', iosDefines],
	['var a = 1.0;', 'var a=1', iosDefines],
	['var a = 1.02;', 'var a=1.02', iosDefines],
	['var a = -1.02;', 'var a=-1.02', iosDefines],
	['var a = !1', 'var a=!1', iosDefines],
	['var a = true ? 1 : 0;', 'var a=true?1:0', iosDefines],
	["var num = isNaN(amount) || amount === '' || amount === null ? 0.00 : amount;", 'var num=isNaN(amount)||amount===""||amount===null?0:amount', iosDefines],
	
	// make sure we didn't break normal if conditions
	['if (true) { var a = 1; } else { var a = 2; }', "if(true){var a=1}else{var a=2}", iosDefines],
	
	// check platform conditionals (if/else)
	["if (Titanium.Platform.name === 'iPhone OS'){ var a = 1; } else { var a = 2; }","var a=1",iosDefines],
	["if (Titanium.Platform.name !== 'iPhone OS'){ var a = 2; } else { var a = 1; }","var a=1",iosDefines],
	["if (Titanium.Platform['name'] == 'iPhone OS'){ var a = 1; } else { var a = 2; }","var a=1",iosDefines],
	["if (Titanium.Platform['name'] == 'iPhone OS'){ var a = 1; } else { var a = 2; }","var a=1",iosDefines],
	["if (Titanium.Platform.name !== 'iPhone OS'){ var a = 1; } else { var a = 2; }","var a=1",androidDefines],
	["if (Titanium.Platform['name'] !== 'iPhone OS'){ var a = 1; } else { var a = 2; }","var a=1",androidDefines],

	// check platform conditional assignments
	["var platform = Ti.Platform['name'] === 'iPhone OS'", "var platform=1", iosDefines],
	["var platform = Ti.Platform[\"name\"] === 'iPhone OS'", "var platform=1", iosDefines],
	["var platform = Ti.Platform.name === 'iPhone OS'", "var platform=1", iosDefines],
	["var platform = Ti.Platform.name === 'iPhone OS'", "var platform=0", androidDefines],
	["var platform = (Ti.Platform.name === 'iPhone OS')", "var platform=1", iosDefines],
	["var platform = (Ti.Platform.name === 'iPhone OS') ? 1 : 0", "var platform=1", iosDefines],
	["var platform = (Ti.Platform.name === 'iPhone OS') ? true : false", "var platform=true", iosDefines],
	["var platform = (Ti.Platform.name === 'iPhone OS') ? 1 : 0", "var platform=0", androidDefines],
	["var platform = (Ti.Platform.name === 'iPhone OS') ? true : false", "var platform=false", androidDefines],
	["var platform = (Ti.Platform.name == 'iPhone OS') ? 'true' : 'false'", "var platform=\"true\"", iosDefines],
	["var platform = (Ti.Platform.name == 'iPhone OS') ? 'true' : 'false'", "var platform=\"false\"", androidDefines],
	["var platform = (Ti.Platform.osname == 'android') ? 'true' : 'false'", "var platform=\"true\"", androidDefines],
	["var platform = (Ti.Platform.osname == \"iphone\") ? 1 : 0", "var platform=Ti.Platform.osname==\"iphone\"?1:0", iosDefines],

	// FAIL: doesn't properly handle conditionals without curly braces (false negative, breaks code)
	["if (Ti.Platform.osname === 'android') var a = 1; else var a = 2;","var a=1;",androidDefines],
	
	// PASS: shouldn't attempt to process anything other than strings
	["if (Ti.Platform.name === couldBeAnything()) { var a = 1; } else { var a = 2; }","if(Ti.Platform.name===couldBeAnything()){var a=1}else{var a=2}",iosDefines],

	// FAIL: Only works if Ti.Platform.* is on the left hand side (false negative)
	["if ('android' === Ti.Platform.osname) { var a = 1; } else { a = 2; }","var a=1;",androidDefines],
];
*/

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

function pad(string) {
	var ret = '';
	for (var i = 0; i < 10 - string.length; i++) {
		ret += ' ';
	}
	return ret;
}

// The alloy command test suite
describe('optimizer.js', function() {
	_.each(tests, function(test, index) {
		_.each(platforms, function(platformObj, platform) {
			var ast, code,
				prefix = 'test #' + (index+1) + ' [' + platform + ']' + pad(platform),
				defines = {
					OS_ANDROID: platform === 'android',
					OS_IOS: platform === 'ios',
					OS_MOBILEWEB: platform === 'mobileweb'
				};

			it(prefix + 'parses AST with uglifyjs', function() {
				var parseFunction = function() {
					ast = jsp.parse(_.template(test[0], platforms[platform]));
				};
				expect(parseFunction).not.toThrow();
			});
			
			it(prefix + 'optimizes AST', function() {
				var optimizeFunction = function() {
					ast = optimizer.optimize(ast, defines);
				};
				expect(optimizeFunction).not.toThrow();
			});

			it(prefix + 'generates code from optimized AST', function() {
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