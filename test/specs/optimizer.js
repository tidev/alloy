var fs = require('fs'),
	path = require('path'),
	colors = require('colors'),
	TU = require('../lib/testUtils'),
	CONST = require('../../Alloy/common/constants'),
	_ = require('lodash'),
	sourceMapper = require('../../Alloy/commands/compile/sourceMapper'),
	babylon = require('@babel/parser'),
	transform = require('../../Alloy/commands/compile/ast/transform'),
	optimizerVisitor = require('../../Alloy/commands/compile/ast/optimizer-plugin');

var tests = [
	// make sure we didn't break normal conditionals and assigments
	['var test = {\n  a: 0,\n  b:0,\n  c:  0};\ntest.b = 1', 'var test = {\n  a: 0,\n  b: 0,\n  c: 0 };\ntest.b = 1;'],
	['var a = Ti.Platform.name', 'var a = "<%= name %>";'],
	['var a = Titanium.Platform.name', 'var a = "<%= name %>";'],
	['var a = Ti.Platform.name=="<%= name %>" ? 1 : 0', 'var a = "<%= name %>" == "<%= name %>" ? 1 : 0;'],
	['var a = Ti.Platform.name=="<%= name %>",\nb', 'var a = "<%= name %>" == "<%= name %>",\n  b;'],
	['var a = Ti.Platform.name=="<%= name %>",\nb,\nc = 2', 'var a = "<%= name %>" == "<%= name %>",\n  b,\n  c = 2;'],
	['var a = Ti.Platform.name=="<%= name %>"', 'var a = "<%= name %>" == "<%= name %>";'],
	['var a,\nb = Ti.Platform.name=="<%= name %>",\nc = 2;', 'var a,\n  b = "<%= name %>" == "<%= name %>",\n  c = 2;'],
	['var a = "<%= name %>"==Ti.Platform.name ? 1 : 0', 'var a = "<%= name %>" == "<%= name %>" ? 1 : 0;'],
	['var a = "<%= name %>"==Ti.Platform.name,\nb', 'var a = "<%= name %>" == "<%= name %>",\n  b;'],
	['var a = "<%= name %>"==Ti.Platform.name,\nb,\nc = 2', 'var a = "<%= name %>" == "<%= name %>",\n  b,\n  c = 2;'],
	['var a = "<%= name %>"==Ti.Platform.name', 'var a = "<%= name %>" == "<%= name %>";'],
	['var a,\nb = "<%= name %>"==Ti.Platform.name,\nc = 2;', 'var a,\n  b = "<%= name %>" == "<%= name %>",\n  c = 2;'],
	['var a = "1"', 'var a = "1";'],
	['var a = true', 'var a = true;'],
	['var a = 1', 'var a = 1;'],
	['var a', 'var a;'],
	['var a = {}', 'var a = {};'],
	['var a = new Object', 'var a = new Object();'],
	['var a = new Object()', 'var a = new Object();'],
	['var a = Ti.Platform.name', 'var a = "<%= name %>";'],
	['var a = Ti.Platform.osname', 'var a = "android";', ['android']],
	['var a,\nb = 1,\nc = 2;', 'var a,\n  b = 1,\n  c = 2;'],
	['var a = 1;', 'var a = 1;'],
	['var a =+1;', 'var a = +1;'],
	['var a =1+1;', 'var a = 1 + 1;'],
	['var a = 1.0;', 'var a = 1.0;'],
	['var a = 1.02;', 'var a = 1.02;'],
	['var a = -1.02;', 'var a = -1.02;'],
	['var a = false', 'var a = false;'],
	['var a = true ? 1 : 0;', 'var a = true ? 1 : 0;'],
	["var num = isNaN(amount) || amount === '' || amount === null ? 0.00 : amount;", 'var num = isNaN(amount) || amount === \'\' || amount === null ? 0.00 : amount;'],

	// TODO: Revisit all "var a,a=2;" expecteds once ALOY-540 is resolved

	// make sure we didn't break normal if conditions
	['if (true) {\n  var a = 1;\n} else {\n  var a = 2;\n}', "if (true) {\n  var a = 1;\n} else {\n  var a = 2;\n}"],

	// check platform conditionals (if/else)
	["if (Titanium.Platform.name === '<%= name %>') {\n  var a = 1;\n} else {\n  var a = 2;\n}", "if (\"<%= name %>\" === '<%= name %>') {\n  var a = 1;\n} else {\n  var a = 2;\n}"],
	["if (Titanium.Platform.name !== '<%= name %>') {\n  var a = 1;\n} else {\n  var a = 2;\n}", "if (\"<%= name %>\" !== '<%= name %>') {\n  var a = 1;\n} else {\n  var a = 2;\n}"],
	["if (Titanium.Platform['name'] == '<%= name %>') {\n  var a = 1;\n} else {\n  var a = 2;\n}", "if (\"<%= name %>\" == '<%= name %>') {\n  var a = 1;\n} else {\n  var a = 2;\n}"],
	["if (Titanium.Platform.name !== '<%= name %>') {\n  var a = 1;\n} else {\n  var a = 2;\n}", "if (\"<%= name %>\" !== '<%= name %>') {\n  var a = 1;\n} else {\n  var a = 2;\n}"],
	["if (Titanium.Platform['name'] !== '<%= name %>') {\n  var a = 1;\n} else {\n  var a = 2;\n}", "if (\"<%= name %>\" !== '<%= name %>') {\n  var a = 1;\n} else {\n  var a = 2;\n}"],

	// check platform conditional assignments
	["var platform = Ti.Platform['name'] === '<%= name %>'", "var platform = \"<%= name %>\" === '<%= name %>';"],
	["var platform = Ti.Platform[\"name\"] === '<%= name %>'", "var platform = \"<%= name %>\" === '<%= name %>';"],
	["var platform = Ti.Platform.name === '<%= name %>'", "var platform = \"<%= name %>\" === '<%= name %>';"],
	["var platform = (Ti.Platform.name === '<%= name %>') ? 1 : 0", "var platform = \"<%= name %>\" === '<%= name %>' ? 1 : 0;"],
	["var platform = (Ti.Platform.name === '<%= name %>') ? true : false", "var platform = \"<%= name %>\" === '<%= name %>' ? true : false;"],

	// check identities
	["var a = Ti.Platform.name === Titanium.Platform.name","var a = \"<%= name %>\" === \"<%= name %>\";"],

	// shouldn't attempt to process anything other than strings
	["if (Ti.Platform.name === couldBeAnything()) {\n  var a = 1;\n} else {\n  var a = 2;\n}","if (\"<%= name %>\" === couldBeAnything()) {\n  var a = 1;\n} else {\n  var a = 2;\n}"],
	["if (Ti.Platform.name === some.Other.Value) {\n  var a = 1;\n} else {\n  var a = 2;\n}","if (\"<%= name %>\" === some.Other.Value) {\n  var a = 1;\n} else {\n  var a = 2;\n}"],
	["if (Ti.Platform.name !== aVariable) {\n  var a = 1;\n} else {\n  var a = 2;\n}","if (\"<%= name %>\" !== aVariable) {\n  var a = 1;\n} else {\n  var a = 2;\n}"],

	// properly handles conditionals without curly braces
	["if (Ti.Platform.name === '<%= name %>') var a = 1; else var a = 2;", "if (\"<%= name %>\" === '<%= name %>') var a = 1;else var a = 2;"],
	["if (Ti.Platform.name !== '<%= name %>') var a = 1; else var a = 2;", "if (\"<%= name %>\" !== '<%= name %>') var a = 1;else var a = 2;"],
	["if ('<%= name %>' === Ti.Platform.name) var a = 1; else var a = 2;", "if ('<%= name %>' === \"<%= name %>\") var a = 1;else var a = 2;"],
	["if ('<%= name %>' !== Ti.Platform.name) var a = 1; else var a = 2;", "if ('<%= name %>' !== \"<%= name %>\") var a = 1;else var a = 2;"],

	// works if Ti.Platform.* is on the left or right hand side
	["if ('<%= name %>' === Ti.Platform.name) {\n  var a = 1;\n} else {\n  a = 2;\n}", "if ('<%= name %>' === \"<%= name %>\") {\n  var a = 1;\n} else {\n  a = 2;\n}"],

	['var a = OS_IOS', 'var a = true;', ['ios']],
	['var a = OS_ANDROID', 'var a = true;', ['android']]
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
						testContent = _.template(test[0])(platforms[platform]),
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

					it(prefix + 'optimizes code via our custom visitors', function() {
						// execute the squeeze to remove dead code, always performed
						// as the last step of JS file processing. The unit testing here
						// uses the same settings as the Alloy compile process.
						var squeezeFunction = function() {
							var visitor = optimizerVisitor({platform: platform});
							code = transform.run(ast, null, visitor, sourceMapper.OPTIONS_OUTPUT).replace(/\s*$/,'');
						};
						expect(squeezeFunction).not.toThrow();
					});
					it(prefix + 'generated code matches expected code', function() {
						var passFor = test[2];
						var expected = _.template(test[1])(platforms[platform]);
						if (!passFor || _.includes(passFor, platform)) {
							expect(code).toBe(expected);
						} else {
							expect(code).not.toBe(expected);
						}
					});
					it(prefix + 'pre-scan flags code the visitors change', function() {
						var unchanged = transform.run(babylon.parse(testContent), null, {}, sourceMapper.OPTIONS_OUTPUT).replace(/\s*$/,'');
						if (code !== unchanged) {
							expect(transform.needsOptimize(testContent)).toBe(true);
						}
					});
				});
			});
		});
	});
});

describe('transform.needsOptimize', function() {
	_.each([
		'var a = Ti.Platform.name;',
		'var a = Titanium.Platform.osname;',
		'var a = Ti.Platform[\'osname\'];',
		'var a = Titanium.Platform["name"];',
		'var a = Ti\n\t.Platform\n\t.osname;',
		'var a = Ti[\'Platform\'].name;',
		'var a = Ti /* comment */ . Platform.name;',
		'var a = Titanium // comment\n\t.Platform.osname;',
		'var a = Ti[/* comment */ \'Platform\'].name;',
		'if (OS_IOS) {}',
		'if (ENV_PROD) {}'
	], function(src) {
		it('flags ' + JSON.stringify(src), function() {
			expect(transform.needsOptimize(src)).toBe(true);
		});
	});

	_.each([
		'var a = Ti.UI.createView();',
		'var TiPlatform = 1;',
		'var a = foo.OS_IOSX;',
		'var a = Ti /* unterminated . Platform.name;'
	], function(src) {
		it('skips ' + JSON.stringify(src), function() {
			expect(transform.needsOptimize(src)).toBe(false);
		});
	});

	it('fails fast on a long run of comments', function() {
		var src = 'Ti' + _.repeat(' /* a */ // b\n', 5000) + 'x';
		var start = Date.now();
		expect(transform.needsOptimize(src)).toBe(false);
		expect(Date.now() - start).toBeLessThan(1000);
	});
});

describe('transform.hasAlloyRequire', function() {
	_.each([
		'var m = require(\'alloy/moment\');',
		'var m = require("/alloy/moment");',
		'var m = require (\n\t\'alloy/moment\');',
		'var m = require /* comment */ (/* comment */ \'alloy/moment\');',
		'var m = require // comment\n(\'alloy/moment\');'
	], function(src) {
		it('flags ' + JSON.stringify(src), function() {
			expect(transform.hasAlloyRequire(src)).toBe(true);
		});
	});

	_.each([
		'var m = require(\'moment\');',
		'var m = myrequire(\'alloy/moment\');',
		'var m = require /* unterminated (\'alloy/moment\');'
	], function(src) {
		it('skips ' + JSON.stringify(src), function() {
			expect(transform.hasAlloyRequire(src)).toBe(false);
		});
	});
});

describe('transform.stripSourceMapComment', function() {
	_.each([
		['var a = 1;\n//# sourceMappingURL=a.js.map', 'var a = 1;\n'],
		['var a = 1;\n//# sourceMappingURL=a.js.map\n', 'var a = 1;\n'],
		['var a = 1;\r\n//# sourceMappingURL=a.js.map\r\n\r\n', 'var a = 1;\r\n'],
		['var a = 1;\n//@ sourceMappingURL=a.js.map\n', 'var a = 1;\n'],
		['var a = 1;\n/*# sourceMappingURL=a.js.map */\n', 'var a = 1;\n'],
		['var a = 1;\n//# sourceMappingURL=data:application/json;base64,eyJ9\n', 'var a = 1;\n'],
		['var a = 1;\n//# sourceMappingURL=a.js.map\n/*# sourceMappingURL=b.js.map */\n', 'var a = 1;\n'],
		['var a = 1;\n', 'var a = 1;\n'],
		['//# sourceMappingURL=a.js.map\nvar a = 1;\n', '//# sourceMappingURL=a.js.map\nvar a = 1;\n'],
		['var a = `\n//# sourceMappingURL=a.js.map`;\n', 'var a = `\n//# sourceMappingURL=a.js.map`;\n'],
		['var a = "//# sourceMappingURL=a.js.map"', 'var a = "//# sourceMappingURL=a.js.map"']
	], function(test) {
		it('handles ' + JSON.stringify(test[0]), function() {
			expect(transform.stripSourceMapComment(test[0])).toBe(test[1]);
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
