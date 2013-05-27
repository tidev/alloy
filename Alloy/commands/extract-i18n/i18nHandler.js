var U = require('../../utils'),
    path = require('path'),
    _ = require("../../lib/alloy/underscore")._,
    fs = require('fs');

module.exports = function(projectRoot, language) {
    var file = projectRoot + '/i18n/' + language + '/strings.xml';

    var api = {
        merge: function(strings) {
            var content = api.read();
            var result = {};
            var newStrings = [];

            for (key in strings) {
                var string = strings[key];
                result[string] = content[string] || string;

                if (content[string]) {
                    delete content[string];
                } else {
                    newStrings.push(string);
                }
            }

            return {
                merged: result,
                unused: content,
                new: newStrings
            };
        },

        read: function() {
            var strings = {};
            var content = U.XML.parseFromFile(file);
            var nodes = content.getElementsByTagName('string');

            _.each(nodes, function(node) {
                var sourceName = node.attributes.getNamedItem('name').nodeValue;
                strings[sourceName] = node.childNodes[0].nodeValue;
            });

            return strings;
        },

        write: function(strings) {
            var result = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<resources>";

            for (key in strings) {
                result += "\n  <string name=\"" + key + "\"><![CDATA[" + strings[key] + "]]></string>";
            }

            result += "\n</resources>";
            fs.writeFileSync(file, result);
        }
    };

    return api;
}
