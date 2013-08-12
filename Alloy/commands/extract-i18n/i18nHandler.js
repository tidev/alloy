var U = require('../../utils'),
    logger = require('../../logger'),
    path = require('path'),
    _ = require("../../lib/alloy/underscore")._,
    XMLSerializer = require("xmldom").XMLSerializer,
    fs = require('fs'),
    path = require('path'),
    wrench = require('wrench'),
    os = require('os');

var FILE_TEMPLATE = '<?xml version="1.0" encoding="UTF-8"?>' + os.EOL + '<resources>' +
    os.EOL + '</resources>';

module.exports = function(projectRoot, language) {
    var i18nDir = path.join(projectRoot, 'i18n', language);
    var i18nFile = path.join(i18nDir, 'strings.xml');
    var shortPath = path.relative(projectRoot, i18nFile);

    // create 18n folder if it doesn't exist
    if (!fs.existsSync(i18nDir)) {
        wrench.mkdirSyncRecursive(i18nDir, 0755);
    }

    // create i18n file if it doesn't exist
    if (!fs.existsSync(i18nFile)) {
        fs.writeFileSync(i18nFile, FILE_TEMPLATE, 'utf8');
    }

    var api = {
        process: function(strings) {
            var doc = U.XML.parseFromFile(i18nFile);
            var root = doc.documentElement;

            // extracted strings given
            if (_.isArray(strings)) {
                var add = 0,
                    remove = 0;

                // loop existing strings
                _.each(doc.getElementsByTagName('string'), function (node) {
                    var i = strings.indexOf(node.getAttribute('name'));

                    // in code > don't add
                    if (-1 !== i) {
                        delete strings[i];

                    // not in code > remove
                    } else if (clean) {
                        
                        // Leave as comment
                        root.appendChild(doc.createTextNode('  '));
                        root.appendChild(doc.createComment(U.XML.toString(node)));
                        root.appendChild(doc.createTextNode('\n'));

                        doc.documentElement.removeChild(node);

                        remove++;
                    }
                });

                if (clean) {
                    logger.info(('Removing ' + remove + ' string' + (remove !== 1 ? 's' : '')).yellow);
                }
                
                logger.info(('Adding ' + add + ' string' + (add !== 1 ? 's' : '')).yellow);

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
            }

            // serialize the document and write it back to the strings.xml file
            var serializer = new XMLSerializer();
            return serializer.serializeToString(doc);
        },

        // Print the XML that would be written to your strings.xml file with --apply
        print: function(strings) {
            logger.info('######## BEFORE ########' + os.EOL + api.process());
            logger.info('######## AFTER  ########' + os.EOL + api.process(strings));
            logger.info(' ');
            logger.warn('Did not write the "' + shortPath + '" file - use "--apply" option to write.');
        },

        // Append any new localization strings to the existing strings.xml file
        write: function(strings) {
            fs.writeFileSync(i18nFile, api.process(strings), 'utf8');
            logger.info(('Wrote strings in the "' + path.relative(projectRoot, i18nFile) + '" file.').green);
        }
    };

    return api;
};
