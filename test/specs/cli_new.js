var fs = require('fs'),
	path = require('path'),
	exists = path.existsSync,
	exec = require('child_process').exec,
	spawn = require('child_process').spawn,
	wrench = require('wrench'),
	DOMParser = require("xmldom").DOMParser,
	XMLSerializer = require("xmldom").XMLSerializer,
	titanium = require('../../Alloy/common/titanium');

//This is the path to the folder where generated stuff should go for CLI commands
var GEN = path.join(process.cwd(),'test', 'generated'),
	APP = path.join(GEN, 'TestApp');

function initGen() {
	if (exists(GEN)) {
		wrench.rmdirSyncRecursive(GEN);
	}
	fs.mkdirSync(GEN);
}

describe('the "new" command in the CLI', function() {
	initGen();
	
	it('will generate a valid project folder at the given path', function() {
		//for this one we're going to generate a project, and for that we need the Android SDK		
		if (!process.env.ANDROID_SDK) {
			console.log('Please define $ANDROID_SDK environment variable and point it to your top level Android SDK install directory');
			expect(process.env.ANDROID_SDK).toBeDefined();
		}
		else {
			var done, created;
			runs(function() {
				var p = titanium.create('TestApp', 'com.appc.testapp', GEN, ['mobileweb', 'iphone', 'android'], process.env.ANDROID_SDK);
				p.on('exit', function(code) {
					if (code === 0) {
						created = true;
						exec('alloy new '+APP, function(err, stdout, stderr) {
							done = true;
						});
					}
					else {
						done = true;
					}
				});
			});

			waitsFor(function() {
				return done;
			},1500);

			runs(function() {
				//ensure the proper artifacts have been created
				expect(exists(APP)).toBe(true);
				expect(exists(path.join(APP,'app', 'alloy.jmk'))).toBe(true);
				expect(exists(path.join(APP,'app', 'assets'))).toBe(true);
				expect(exists(path.join(APP,'app', 'config', 'alloy.json'))).toBe(true);
				expect(exists(path.join(APP,'app', 'config', 'config.json'))).toBe(true);
				expect(exists(path.join(APP,'app', 'config', 'alloy.json'))).toBe(true);
				expect(exists(path.join(APP,'app', 'controllers', 'index.js'))).toBe(true);
				expect(exists(path.join(APP,'app', 'lib'))).toBe(true);
				expect(exists(path.join(APP,'app', 'migrations'))).toBe(true);
				expect(exists(path.join(APP,'app', 'models'))).toBe(true);
				expect(exists(path.join(APP,'app', 'README'))).toBe(true);
				expect(exists(path.join(APP,'app', 'styles', 'index.json'))).toBe(true);
				expect(exists(path.join(APP,'app', 'vendor'))).toBe(true);
				expect(exists(path.join(APP,'app', 'views', 'index.xml'))).toBe(true);
				expect(exists(path.join(APP,'plugins', 'ti.alloy', 'plugin.py'))).toBe(true);
				
				//ensure compiler plugin has been added to tiapp.xml
				var tiapp = path.join(APP,'tiapp.xml');
				var xml = fs.readFileSync(tiapp);
				var doc = new DOMParser().parseFromString(String(xml));
				var plugins = doc.documentElement.getElementsByTagName("plugins");
				
				//plugins node should exist and have children
				expect(plugins.length).toBeGreaterThan(0);
				
				//verify contents of the plugin - since this is a fresh project, will be just the one.
				var plugin = plugins.item(0).getElementsByTagName('plugin').item(0);
				expect(plugin.textContent).toBe('ti.alloy');
			});
		}
	});
});