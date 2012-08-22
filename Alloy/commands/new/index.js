var path = require('path'),
	fs = require('fs'),
	wrench = require('wrench'),
	DOMParser = require("xmldom").DOMParser,
	XMLSerializer = require("xmldom").XMLSerializer,
	_ = require('../../lib/alloy/underscore')._,
	U = require('../../utils'),
	CONST = require('../../common/constants'),
	logger = require('../../common/logger'),
	alloyRoot = path.join(__dirname,'..', '..');

function createPlugin(rootDir) {
	var plugins = path.join(rootDir,"plugins");
	U.ensureDir(plugins);
	
	var alloyPluginDir = path.join(plugins,"ti.alloy");
	U.ensureDir(alloyPluginDir);
	
	var alloyPlugin = path.join(alloyPluginDir,"plugin.py");
	var pi = path.join(alloyRoot,"plugin","plugin.py");
	
	U.copyFileSync(pi,alloyPlugin);
	logger.info('Deployed ti.alloy plugin to '+alloyPlugin);
}

function installPlugin(dir)
{
	createPlugin(dir);

	var tiapp = path.join(dir,'tiapp.xml');
	if (path.existsSync(tiapp))
	{
		var xml = fs.readFileSync(tiapp);
		var doc = new DOMParser().parseFromString(String(xml));
		var plugins = doc.documentElement.getElementsByTagName("plugins");
		var found = false;

		if (plugins.length > 0)
		{
			var items = plugins.item(0).getElementsByTagName('plugin');
			if (items.length > 0)
			{
				for (var c=0;c<items.length;c++)
				{
					var plugin = items.item(c);
					var name = U.XML.getNodeText(plugin);
					if (name == 'ti.alloy')
					{
						found = true;
						break;
					}
				}
			}
		}
		
		if (!found)
		{
			var node = doc.createElement('plugin');
			node.setAttribute('version','1.0');
			var text = doc.createTextNode('ti.alloy');
			node.appendChild(text);
			
			var pna = null;
			
			// install the plugin into tiapp.xml
			if (plugins.length == 0)
			{
				var pn = doc.createElement('plugins');
				doc.documentElement.appendChild(pn);
				doc.documentElement.appendChild(doc.createTextNode("\n"));
				pna = pn;
			}
			else
			{
				pna = plugins.item(0);
			}
			
			pna.appendChild(node);
			pna.appendChild(doc.createTextNode("\n"));
			
			var serializer = new XMLSerializer();
			var newxml = serializer.serializeToString(doc);
			
			fs.writeFileSync(tiapp,newxml,'utf-8');
			logger.info("Installed 'ti.alloy' plugin to "+tiapp);
		}
	}
}

function newproject(args, program) {
	var dirs = ['controllers','styles','views','models','assets'],
		templateDir = path.join(alloyRoot,'template'),
		defaultDir = path.join(templateDir,'default'),
		INDEX_XML  = fs.readFileSync(path.join(defaultDir,'index.'+CONST.FILE_EXT.VIEW),'utf8'),
		INDEX_JSON = fs.readFileSync(path.join(defaultDir,'index.'+CONST.FILE_EXT.STYLE),'utf8'),
		INDEX_C    = fs.readFileSync(path.join(defaultDir,'index.'+CONST.FILE_EXT.CONTROLLER),'utf8'),
		README     = fs.readFileSync(path.join(templateDir, 'README'),'utf8'),
		projectPath, appPath, resourcesPath, tmpPath, alloyJmkTemplate, cfg;

	// validate args
	if (!_.isArray(args) || args.length === 0) {
		args[0] = '.';
	}

	// get app path, create if necessary
	projectPath = args[0];
	appPath = path.join(projectPath,'app');
	resourcesPath = path.join(projectPath,'Resources');
	if (path.existsSync(appPath)) {
		if (!program.force) {
			U.die("Directory already exists at: " + appPath);
		} else {
			wrench.rmdirSyncRecursive(appPath);
		}
	}
	wrench.mkdirSyncRecursive(appPath, 0777);
	
	// create alloy app directories
	for (var c = 0; c < dirs.length; c++) {
		tmpPath = path.join(appPath, dirs[c]);
		if (!path.existsSync(tmpPath)) {
			wrench.mkdirSyncRecursive(tmpPath, 0777);
		}
	}
	
	// create default view, controller, style, and config. 
	fs.writeFileSync(path.join(appPath,'views','index.'+CONST.FILE_EXT.VIEW),INDEX_XML,'utf-8');
	fs.writeFileSync(path.join(appPath,'styles','index.'+CONST.FILE_EXT.STYLE),INDEX_JSON,'utf-8');
	fs.writeFileSync(path.join(appPath,'controllers','index.'+CONST.FILE_EXT.CONTROLLER),INDEX_C,'utf-8');
	fs.writeFileSync(path.join(appPath,'README'),README,'utf-8');

	// copy in any modules
	wrench.copyDirSyncRecursive(path.join(alloyRoot,'modules'), projectPath, {preserve:true});

	// TODO: remove this once this is merged: https://github.com/appcelerator/titanium_mobile/pull/2610
	U.installModule(projectPath, {
		id: 'ti.physicalSizeCategory',
		platform: 'android',
		version: '1.0'
	});

	// write the build file
	alloyJmkTemplate = fs.readFileSync(path.join(templateDir,'alloy.jmk'), 'utf8');
	fs.writeFileSync(path.join(appPath,'alloy.jmk'), alloyJmkTemplate,'utf-8');
		
	// write the project config file
	cfg = {global:{}, "env:development":{}, "env:test":{}, "env:production":{}, "os:ios":{}, "os:android":{}};
	fs.writeFileSync(path.join(appPath,"config.json"), U.stringifyJSON(cfg),'utf-8');

	// install the plugin
	installPlugin(projectPath);

	// copy original android, iphone, and mobileweb directories to assets
	_.each(['android','iphone','mobileweb'], function(dir) {
		var rDir = path.join(resourcesPath,dir);
		if (!path.existsSync(rDir)) {
			return;
		}

		var p = path.join(appPath,'assets',dir);
		wrench.mkdirSyncRecursive(p, 0777);
		wrench.copyDirSyncRecursive(path.join(resourcesPath,dir), p);
	});
	
	logger.info('Generated new project at: ' + appPath);
}

module.exports = newproject;