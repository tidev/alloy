var U = require('../../utils'),
	logger = require('../../logger'),
	path = require('path'),
	_ = require('lodash'),
	XMLSerializer = require('xmldom').XMLSerializer,
	fs = require('fs-extra'),
	chmodr = require('chmodr'),
	os = require('os');

var FILE_TEMPLATE = '<?xml version="1.0" encoding="UTF-8"?>' + os.EOL + '<resources>' +
	os.EOL + '</resources>';

function check(strings) {
	if (!strings || strings.length === 0) {
		logger.warn('No new i18n strings found. Nothing to do.');
		process.exit(0);
	}
}

module.exports = function(projectRoot, language) {
	var i18nDir = path.join(projectRoot, 'app', 'i18n', language);
	var i18nFile = path.join(i18nDir, 'strings.xml');
	var shortPath = path.relative(projectRoot, i18nFile);

	// create 18n folder if it doesn't exist
	if (!fs.existsSync(i18nDir)) {
		fs.mkdirpSync(i18nDir);
		chmodr.sync(i18nDir, 0755);
	}

	// create i18n file if it doesn't exist
	if (!fs.existsSync(i18nFile)) {
		fs.writeFileSync(i18nFile, FILE_TEMPLATE, 'utf8');
	}

	var api = {
		process: function(strings) {
			var doc = U.XML.parseFromFile(i18nFile);
			var root = doc.documentElement;

			// create a <string> node for each new string key
			_.each(strings, function(str) {
				var node = doc.createElement('string');
				var value = doc.createTextNode(str);
				node.setAttribute('name', str);
				root.appendChild(doc.createTextNode('  '));
				node.appendChild(value);
				root.appendChild(node);
				root.appendChild(doc.createTextNode('\n'));
			});

			// serialize the document and write it back to the strings.xml file
			var serializer = new XMLSerializer();
			return serializer.serializeToString(doc);
		},

		// Get an array of all localization string keys not already in the strings.xml file
		merge: function(strings) {
			var doc = U.XML.parseFromFile(i18nFile);
			var oldStrings = _.map(doc.getElementsByTagName('string'), function(node) {
				return node.attributes.getNamedItem('name').nodeValue;
			});
			return _.difference(strings, oldStrings);
		},

		// Print the XML that would be written to your strings.xml file with --apply
		print: function(strings) {
			check(strings);
			logger.info('######## BEFORE ########' + os.EOL + api.process([]));
			logger.info('######## AFTER  ########' + os.EOL + api.process(strings));
			logger.info(' ');
			logger.warn('Did not write the "' + shortPath + '" file - use "--apply" option to write.');
		},

		// Append any new localization strings to the existing strings.xml file
		write: function(strings) {
			check(strings);
			fs.writeFileSync(i18nFile, api.process(strings), 'utf8');
			logger.info(('Wrote strings in the "' + path.relative(projectRoot, i18nFile) + '" file.').green);
		}
	};

	return api;
};
