var fs = require('fs'),
    path = require('path'),
    wrench = require('wrench'),
    CONST = require('../../common/constants'),
    U = require('../../utils'),
    _ = require("../../lib/alloy/underscore")._,
    logger = require('../../logger'),
    i18nHandler = require('./i18nHandler');

function extractStrings() {
    try {
        var sourceDir = paths.app;
        var files = wrench.readdirSyncRecursive(sourceDir);
        var styleSuffix = '.' + CONST.FILE_EXT.STYLE;
        var controllerSuffix = '.' + CONST.FILE_EXT.CONTROLLER;

        // filter only js and style files
        files = _.filter(files, function(f) {
            return f.substr(-styleSuffix.length) == styleSuffix
                || f.substr(-controllerSuffix.length) == controllerSuffix
        });

        var strings = [];
        _.each(files, function(f) {
            var file = path.join(sourceDir, f);
            var fileContent = fs.readFileSync(file, 'utf8');
            var calls = fileContent.match(/L\([\"'](.*?)[\"']\)/g);

            if (calls && calls.length > 0) {
                logger.debug(file + ': ' + calls.length + ' strings found.');

                _.each(calls, function(call) {
                    strings.push(call.substr(3, call.length - 5));
                });
            }
        });

        strings = _.uniq(strings);
        logger.info("Found " + strings.length + " unique i18n strings in code.");
        return strings;
    } catch(E) {
        return [];
    }
}

module.exports = function(args, program) {
    paths = U.getAndValidateProjectPaths(
        program.outputPath || args[0] || process.cwd()
    );
    var strings = extractStrings();
    var language = args[0] || 'en';
    var handler = i18nHandler(paths.project, language);
    var merged = handler.merge(strings);

    if (program.force) {
        handler.write(merged.merged);
        logger.info('Wrote strings in the i18n file.'.green);
    } else {
        logger.info('Did not write the i18n file - please pass the "--force" option.'.red);
    }

    var status = 'Completed i18n extraction. Found ' + merged.new.length + ' new strings.';
    logger.info(status.green);
};
