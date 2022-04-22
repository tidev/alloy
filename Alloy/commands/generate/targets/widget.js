var path = require('path'),
	fs = require('fs-extra'),
	jsonlint = require('jsonlint'),
	U = require('../../../utils'),
	_ = require('lodash'),
	CONST = require('../../../common/constants'),
	logger = require('../../../logger');

var VERSION_DEFAULT = '1.0';

module.exports = function(name, args, program) {
	var widgetId = args[0] || name;
	var types = ['VIEW', 'CONTROLLER', 'STYLE'];
	var thePaths = U.getAndValidateProjectPaths(program.outputPath || program.projectDir);
	var paths = getPaths(thePaths.app, widgetId);

	// don't overwrite an existing widget unless force is specified
	if (path.existsSync(paths.widget) && !program.force) {
		U.die('Widget already exists: ' + paths.widget);
	}

	// create default alloy widget folders and files
	_.each(types, function(type) {
		var typeFolder = path.join(paths.widget, CONST.DIR[type]);
		var typeTemplate = path.join(paths.template, 'widget', type.toLowerCase() + '.' +
			CONST.FILE_EXT[type]);

		fs.mkdirpSync(typeFolder);
		fs.writeFileSync(
			path.join(typeFolder, CONST.NAME_WIDGET_DEFAULT + '.' + CONST.FILE_EXT[type]),
			fs.readFileSync(typeTemplate, 'utf8')
		);
	});
	fs.mkdirpSync(path.join(paths.widget, CONST.DIR.ASSETS));

	// create widget.json manifest file
	fs.writeFileSync(
		path.join(paths.widget, 'widget.json'),
		_.template(fs.readFileSync(paths.widgetTemplate, 'utf8'))({
			id: escapeDoubleQuotes(widgetId),
			name: escapeDoubleQuotes(name),
			version: VERSION_DEFAULT,
			platforms: U.getDeploymentTargets(thePaths.project)
		})
	);

	// Add this widget as a dependency to our project
	var configReadPath = path.existsSync(paths.config) ? paths.config : paths.configTemplate;
	var content = fs.readFileSync(configReadPath, 'utf8');
	try {
		var json = jsonlint.parse(content);
		json.dependencies = json.dependencies || {};
		json.dependencies[widgetId] = VERSION_DEFAULT;
		fs.writeFileSync(paths.config, JSON.stringify(json, null, 4));
	} catch (e) {
		U.die('Error while adding widget dependency to config.json in "' + configReadPath + '"', e);
	}

	logger.info('Generated widget named ' + name);
};

function getPaths(appPath, widgetId) {
	var alloy = path.join(__dirname, '..', '..', '..');
	var template = path.join(alloy, 'template');

	return {
		// alloy paths
		alloy: alloy,
		template: template,
		widgetTemplate: path.join(template, 'widget.json'),
		configTemplate: path.join(template, 'config.json'),

		// project paths
		widget: path.join(appPath, 'widgets', widgetId),
		config: path.join(appPath, 'config.json')
	};
}

function escapeDoubleQuotes(string) {
	return string.replace(/"/g, '\\"');
}
