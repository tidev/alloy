var path = require('path'),
	fs = require('fs'),
	wrench = require('wrench'),
	U = require('../../../utils'),
	_ = require("../../../lib/alloy/underscore")._,
	CONST = require('../../../common/constants'),
	logger = require('../../../common/logger'),
	alloyRoot = path.join(__dirname,'..','..','..');

module.exports = function(name, args, program) {
	if(name.match("^com\.")) {
		var widgetId = args[0] || name;	
	} else {
		var widgetId = args[0] || 'com.default.' + name;
	}
	var widgetDesc = args[1] || '';

	var widgetPath = path.join(program.outputPath,'widgets',widgetId);
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

	_.each(['VIEW','CONTROLLER','STYLE'], function(type) {
		var templatePath = path.join(alloyRoot,'template', type.toLowerCase() + '.' + CONST.FILE_EXT[type]);
		var contents = fs.readFileSync(templatePath,'utf8');
		fs.writeFileSync(path.join(widgetPath, type.toLowerCase() + 's', 'widget.' + CONST.FILE_EXT[type]), contents);
	});

	logger.info('Generated widget named '+name);
}