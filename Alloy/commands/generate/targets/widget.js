var path = require('path'),
	fs = require('fs'),
	wrench = require('wrench'),
	U = require('../../../utils'),
	_ = require("../../../lib/alloy/underscore")._,
	CONST = require('../../../common/constants'),
	logger = require('../../../common/logger');

module.exports = function(name, args, program) {
	var widgetId = args[0] || (name.match("^com\.") ? name : 'com.default.' + name);
	var types = ['VIEW','CONTROLLER','STYLE'];
	var paths = getPaths(program.outputPath, widgetId);

	// don't overwrite an existing widget unless force is specified
	if (path.existsSync(paths.widget) && !program.force) {
		U.die("Widget already exists: " + paths.widget);
	}

	// create default alloy widget folders and files
	_.each(types, function(type) {
		var typeFolder = path.join(paths.widget, CONST.DIR[type]);
		var typeTemplate = path.join(paths.template,type.toLowerCase() + '.' + CONST.FILE_EXT[type]);

		wrench.mkdirSyncRecursive(typeFolder, 0777);
		fs.writeFileSync(
			path.join(typeFolder,CONST.NAME_WIDGET_DEFAULT + '.' + CONST.FILE_EXT[type]),
			fs.readFileSync(typeTemplate,'utf8')
		);
	});

	// create widget.json manifest file
	fs.writeFileSync(
		path.join(paths.widget,'widget.json'), 
		_.template(fs.readFileSync(paths.widgetTemplate,'utf8'), {
			id: escapeDoubleQuotes(widgetId),
			name: escapeDoubleQuotes(name)
		})
	);

	logger.info('Generated widget named ' + name);
}

function getPaths(appPath, widgetId) {
	var alloy = path.join(__dirname,'..','..','..');
	var template = path.join(alloy,'template');

	return {
		// alloy paths
		alloy: alloy,
		template: template,
		widgetTemplate: path.join(template,'widget.json'),

		// project paths
		widget: path.join(appPath,'widgets',widgetId)
	};
}

function escapeDoubleQuotes(string) {
	return string.replace(/"/g,'\\"');
}