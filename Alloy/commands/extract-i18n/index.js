var fs = require('fs'),
    path = require('path'),
    wrench = require('wrench'),
    CONST = require('../../common/constants'),
    U = require('../../utils'),
    _ = require("../../lib/alloy/underscore")._,
    logger = require('../../logger'),
    i18nHandler = require('./i18nHandler');

var searchString = "(?:L|Ti.Locale.getString|Titanium.Locale.getString)" +
    "\\(\\s*[\"']([a-zA-Z]\\w*?)[\"']\\s*[\\),]";
var searchRegex = new RegExp(searchString, 'g');
var valueRegex = new RegExp(searchString);

function extractStrings() {
    try {
        var sourceDir = paths.app;
        var files = wrench.readdirSyncRecursive(sourceDir);
        var styleSuffix = '.' + CONST.FILE_EXT.STYLE;
        var controllerSuffix = '.' + CONST.FILE_EXT.CONTROLLER;

        // filter only js and style files
        files = _.filter(files, function(f) {
            return f.substr(-styleSuffix.length) === styleSuffix ||
                f.substr(-controllerSuffix.length) === controllerSuffix;
        });

        var strings = [];
        _.each(files, function(f) {
            var file = path.join(sourceDir, f);
            var fileContent = fs.readFileSync(file, 'utf8');
            var calls = fileContent.match(searchRegex);

            if (calls && calls.length > 0) {
                logger.debug(file + ': ' + calls.length + ' strings found.');

                _.each(calls, function(call) {
                    var matches = call.match(valueRegex);
                    strings.push(matches[1]);
                });
            }
        });

        strings = _.uniq(strings);
        logger.info("Found " + strings.length + " unique i18n strings in code. Checking against current i18n file...");
        return strings;
    } catch(e) {
        return [];
    }
}

module.exports = function(args, program) {
    paths = U.getAndValidateProjectPaths(
        program.outputPath || process.cwd()
    );
    var language = args[0] || 'en';
    logger.info('extract-i18n for "i18n/' + language + '/strings.xml"');

    var strings = extractStrings();
    var handler = i18nHandler(paths.project, language, program.clean);

    if (program.apply) {
        handler.write(strings);
    } else {
        handler.print(strings);
    }
};
