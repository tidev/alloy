var fs = require('fs'),
	path = require('path'),
	TU = require('../lib/testUtils'),
	CONST = require('../../Alloy/common/constants');

var TIMEOUT_DEFAULT = 1000;

var alloyRoot = path.join(__dirname,'..','..');
var	harnessRoot = path.join(alloyRoot,'test','projects','Harness');
var TiAppRoot = path.join(alloyRoot,'test','projects','TiApp');
var harness = {
	root: harnessRoot,
	hook: path.join(harnessRoot,'plugins',CONST.PLUGIN_NAME,'hooks','alloy.js'),
	plugin: path.join(harnessRoot,'plugins',CONST.PLUGIN_NAME,'plugin.py')
};
var alloy = {
	root: alloyRoot,
	hook: path.join(alloyRoot,'hooks','alloy.js'),
	plugin: path.join(alloyRoot,'Alloy','plugin','plugin.py')
}

// The alloy command test suite
describe('`alloy install', function() {
	it('plugin` is supported', function() {
		TU.asyncExecTest('alloy install plugin "' + harness.root + '"', {
			timeout: TIMEOUT_DEFAULT, 
			test: function() {
				expect(this.output.error).toBeFalsy();
			}
		});
	});

	it('plugin` generates plugins and hooks', function() {
		expect(path.existsSync(harness.hook)).toBeTruthy();
		expect(path.existsSync(harness.plugin)).toBeTruthy();
	});

	it('plugin` generated files match those in Alloy', function() {
		expect(fs.readFileSync(alloy.hook,'utf8')).toBe(fs.readFileSync(harness.hook,'utf8'));
		expect(fs.readFileSync(alloy.plugin,'utf8')).toBe(fs.readFileSync(harness.plugin,'utf8'));
	});

	it('plugin` fails when given a non-existent project path', function() {
		TU.asyncExecTest('alloy install plugin /some/path/that/does/not/exist', {
			timeout: TIMEOUT_DEFAULT, 
			test: function() {
				expect(this.output.error).toBeTruthy();
			}
		});
	});

	it('plugin` fails when given a non-alloy project path', function() {
		TU.asyncExecTest('alloy install plugin "' + TiAppRoot + '"', {
			timeout: TIMEOUT_DEFAULT, 
			test: function() {
				expect(this.output.error).toBeTruthy();
			}
		});
	});

	it('` fails when an invalid type is used', function() {
		TU.asyncExecTest('alloy install invalidType "' + harness.root + '"', {
			timeout: TIMEOUT_DEFAULT, 
			test: function() {
				expect(this.output.error).toBeTruthy();
			}
		});
	});
});