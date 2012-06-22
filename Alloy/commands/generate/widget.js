var path = require('path'),
	fs = require('fs'),
	wrench = require('wrench'),
	U = require('../../utils'),
	_ = require("../../lib/alloy/underscore")._,
	logger = require('../../common/logger');

module.exports = function(name, args, program) {
	// TODO: use name to give default values to widget
	// TODO: allow parameters at CLI to fill in manifest values
	var widgetId = args[0] || 'com.default.' + name;
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
		"min-titanium-version":"2.0"
	}));
	fs.writeFileSync(path.join(widgetPath, 'views', 'widget.xml'), '<View id="defaultView"/>');
	fs.writeFileSync(path.join(widgetPath, 'styles', 'widget.json'), U.stringifyJSON({
		"#defaultView": {
			"backgroundColor": "#a00"
		}
	}));
	fs.writeFileSync(path.join(widgetPath, 'controllers', 'widget.js'), '// do something!');

	logger.info('Generated widget named '+name);
}