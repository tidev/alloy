var path = require('path'),
	fs = require('fs'),
	_ = require('lodash'),
	logger = require('../../../logger'),
	U = require('../../../utils'),
	{ Visitor } = require('@swc/core/Visitor');

var EXCLUDE = ['backbone', 'CFG', 'underscore'];
var BUILTINS_PATH = path.join(__dirname, '..', '..', '..', 'builtins');
var loaded = [];

function isRequire(n) {
	return n.type === 'CallExpression' && n.callee.value == 'require';
}

function appendExtension(file, extension) {
	extension = '.' + extension;
	file = U.trim(file);

	var len = extension.length;
	if (file.substring(file.length - extension.length) !== extension) {
		return file + extension;
	} else {
		return file;
	}
}

function loadBuiltin(source, name, dest) {
	if (!path.existsSync(source)) {
		return;
	}

	logger.debug('  - [' + name + '] --> "' + dest + '"');
	U.copyFileSync(source, dest);
	loaded = _.union(loaded, [name]);
}

function loadMomentLanguages(config) {
	// retrieve the languages of the project
	var i18nPath = path.join(config.dir.project, 'i18n');
	if (fs.existsSync(i18nPath)) {
		var languages = _.filter(fs.readdirSync(i18nPath), function(file) {
			return fs.statSync(path.join(i18nPath, file)).isDirectory();
		});

		// filter the momentjs translation files that match one of these languages
		var availableI18nPath = path.join(BUILTINS_PATH, 'moment', 'lang');
		var fileNames = _.filter(fs.readdirSync(availableI18nPath), function(file) {
			return _.indexOf(languages, file.substr(0, 2)) !== -1;
		});

		// import these files
		_.each(fileNames, function(file) {
			var source = path.join(BUILTINS_PATH, 'moment', 'lang', file);
			var dest = path.join(config.dir.resources, 'alloy', 'moment', 'lang', file);
			loadBuiltin(source, file, dest);
		});
	}
}

module.exports = class BuiltIns extends Visitor {
	constructor(opts) {
		super();
		this.opts = opts;
	}
	visitCallExpression(n) {
		const string = n.arguments[0];
		if (
			isRequire(n) &&
			string.expression.type === 'StringLiteral' &&
			string.expression.value.startsWith('/alloy')
		) {
			const match = string.expression.value.match(/^(\/?alloy)\/(.+)$/);

			if (match) {
				if (!EXCLUDE.includes(match[2]) && !loaded.includes(match[2])) {
					// Make sure it hasn't already been copied to Resources
					var name = appendExtension(match[2], 'js');
					if (fs.existsSync(path.join(this.opts.dir.resources, match[1], name))) {
						return super.visitCallExpression(n);
					}

					// make sure the builtin exists
					var source = path.join(BUILTINS_PATH, name);
					var dest = path.join(this.opts.dir.resources, 'alloy', name);
					loadBuiltin(source, name, dest);

					if ('moment.js' === name) {
						// if momentjs is required in the project, also load the
						// localizations which may be used
						loadMomentLanguages(this.opts);
					}
				}
			}
		}
		return super.visitCallExpression(n);
	}
};