var fs = require('fs'),
	wrench = require('wrench'),
	path = require('path'),
	TU = require('../lib/testUtils'),
	CONST = require('../../Alloy/common/constants'),
	_ = require('../../Alloy/lib/alloy/underscore')._;

var TIMEOUT_DEFAULT = 2000;

var alloyRoot = path.join(__dirname,'..','..');
var TiAppRoot = path.join(alloyRoot,'test','projects','TiApp');
var TiAppCopy = TiAppRoot + 'Copy';

// Create a copy of TiApp to work with
wrench.rmdirSyncRecursive(TiAppCopy, true);
wrench.mkdirSyncRecursive(TiAppCopy, 0777);
wrench.copyDirSyncRecursive(TiAppRoot, TiAppCopy);

var TO_BE_CREATED = [
	path.join('app'),
	path.join('app','config.json'),
	path.join('app','views'),
	path.join('app','views','index.xml'),
	path.join('app','styles'),
	path.join('app','styles','index.tss'),
	path.join('app','models'),
	path.join('app','controllers'),
	path.join('app','controllers','index.js'),
	path.join('app','assets'),
	path.join('plugins'),
	path.join('plugins','ti.alloy'),
	path.join('plugins','ti.alloy','plugin.py'),
	path.join('plugins','ti.alloy','hooks'),
	path.join('plugins','ti.alloy','hooks','alloy.js')
];

// The alloy command test suite
describe('`alloy new`', function() {
	it('executes without error', function() {
		TU.asyncExecTest('alloy new "' + TiAppCopy + '"', TIMEOUT_DEFAULT, function() {
			expect(this.output.error).toBeFalsy();
		});	
	});

	_.each(TO_BE_CREATED, function(file) {
		it('created "' + file + '"', function() {
			expect(path.existsSync(path.join(TiAppCopy,file))).toBeTruthy();
		});
	});

	// TODO: ensure any platform-specific folders that were in Resources got copied to assets
	// TODO: ensure modules got added to tiapp.xml
	// TODO: ensure plugin got added to tiapp.xml
	// TODO: test templates
	// TODO: test alternate command line args (no path, with template, etc...)
	// TODO: create some purposely failing cases

});