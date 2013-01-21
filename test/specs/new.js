var fs = require('fs'),
	wrench = require('wrench'),
	path = require('path'),
	DOMParser = require('xmldom').DOMParser,
	TU = require('../lib/testUtils'),
	CONST = require('../../Alloy/common/constants'),
	_ = require('../../Alloy/lib/alloy/underscore')._;

var TIMEOUT_DEFAULT = 2000;
var PLATFORMS = ['android','ios','mobileweb'];

var alloyRoot = path.join(__dirname,'..','..');
var Harness = path.join(alloyRoot,'test','projects','Harness');
var HarnessTemplate = Harness + 'Template';

var RUNS = [
	{ 
		cmd: 'alloy new "' + Harness + '"', 
		success: true 
	},
	{ 
		cmd: 'alloy new "' + Harness + '" two_tabbed',
		success: true,
		TO_BE_CREATED: [
			path.join('app','assets','KS_nav_ui.png'),
			path.join('app','assets','KS_nav_views.png')
		]
	},
	{
		cmd: 'alloy new /an/invalid/path/to/try',
		success: false
	},
	{
		cmd: 'alloy new "' + Harness + '" invalidTemplate',
		success: false
	},
	{
		cmd: 'cd "' + Harness + '" && alloy new',
		success: true
	}
];

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
	path.join('app','assets','android'),
	path.join('app','assets','iphone'),
	path.join('app','assets','mobileweb'),
	path.join('plugins'),
	path.join('plugins','ti.alloy'),
	path.join('plugins','ti.alloy','plugin.py'),
	path.join('plugins','ti.alloy','hooks'),
	path.join('plugins','ti.alloy','hooks','alloy.js'),
	path.join('tiapp.xml'),
];

_.each(RUNS, function(run) {
	// The alloy new command test suite
	describe('alloy new', function() {
		it('executes `' + run.cmd + '` with ' + (run.success ? 'success' : 'error'), function() {
			// Create a copy of Harness to work with
			wrench.rmdirSyncRecursive(Harness, true);
			wrench.mkdirSyncRecursive(Harness, 0777);
			wrench.copyDirSyncRecursive(HarnessTemplate, Harness);

			TU.asyncExecTest(run.cmd, {
				timeout: TIMEOUT_DEFAULT, 
				test: function() {
					expect((this.output.error === null) === run.success).toBe(true);
				}
			});	
		});

		// process no further is this run is intended to fail
		if (!run.success) { return; }

		_.each(_.union(TO_BE_CREATED,run.TO_BE_CREATED || []), function(file) {
			it('created "' + file + '"', function() {
				expect(path.existsSync(path.join(Harness,file))).toBeTruthy();
			});
		});

		var doc;
		it('generates a tiapp.xml in valid XML format', function() {
			var tiapp = fs.readFileSync(path.join(Harness,'tiapp.xml'),'utf8');
			doc = new DOMParser().parseFromString(tiapp);
			expect(doc).toBeTruthy();
		});

		// TODO: ensure plugin got added to tiapp.xml
		it('adds alloy plugin/hook to tiapp.xml plugins list', function() {
			var plugins = doc.getElementsByTagName('plugin');
			var found = false;

			for (var i = 0; i < plugins.length; i++) {
				var plugin = plugins.item(i);
				if (plugin.nodeType === 1 &&
					plugin.getAttribute('version') === '1.0' &&
					plugin.childNodes[0] &&
					/ti\.alloy/i.test(plugin.childNodes[0].nodeValue)) 
				{
					found = true;
					break;
				}
			}

			expect(found).toBe(true);
		});


		// TODO: test templates
		// TODO: test alternate command line args (no path, with template, etc...)
		// TODO: create some purposely failing cases

	});
});