var path = require('path'),
	fs = require('fs'),
	wrench = require('wrench'),
	U = require('../../../utils'),
	_ = require("../../../lib/alloy/underscore")._,
	CONST = require('../../../common/constants'),
	logger = require('../../../common/logger'),
	alloyRoot = path.join(__dirname,'..','..','..');

module.exports = function(name, args, program) {
	// TODO: use name to give default values to widget
	// TODO: allow parameters at CLI to fill in manifest values
	var templatePath;
	if(name.match("^com\.")) {
		var widgetId = args[0] || name;	
	} else {
		var widgetId = args[0] || 'com.default.' + name;
	}
	var widgetDesc = args[1] || '';

	// TODO: Should we use the widgetId instead of name for the folder name?
	var widgetPath = path.join(program.outputPath,'widgets',name);
	if (path.existsSync(widgetPath) && !program.force) {
		U.die("Widget already exists: "+widgetPath);
	}

	wrench.mkdirSyncRecursive(widgetPath, 0777);
	wrench.mkdirSyncRecursive(path.join(widgetPath, 'views'), 0777);
	wrench.mkdirSyncRecursive(path.join(widgetPath, 'controllers'), 0777);
	wrench.mkdirSyncRecursive(path.join(widgetPath, 'styles'), 0777);
	
	fs.writeFileSync(path.join(widgetPath, 'widget.json'), U.stringifyJSON({
		"id": widgetId,
		"name": name,
		"description" : widgetDesc,
		"author": "",
		"version": "1.0",
		"copyright":"Copyright (c) 2012",
		"license":"Public Domain",
		"min-alloy-version": "1.0",
		"min-titanium-version":"2.0",
		"tags":"",
		"platforms":"android,ios,mobileweb"
	}));
	templatePath = path.join(alloyRoot,'template','view.xml');
	var templateViewContents = fs.readFileSync(templatePath,'utf8');

	fs.writeFileSync(path.join(widgetPath, 'views', 'widget.' + CONST.FILE_EXT.VIEW), _.template(templateViewContents, {}));
	fs.writeFileSync(path.join(widgetPath, 'styles', 'widget.' + CONST.FILE_EXT.STYLE), U.stringifyJSON({
		".container": {
			"backgroundColor": "#a00"
		}
	}));
	
	templatePath = path.join(alloyRoot,'template','controller.js');
	var templateControllerContents = fs.readFileSync(templatePath,'utf8');
	var code = _.template(templateControllerContents, {});	
	fs.writeFileSync(path.join(widgetPath, 'controllers', 'widget.' + CONST.FILE_EXT.CONTROLLER), _.template(templateControllerContents, {}));

	logger.info('Generated widget named '+name);
}