"use strict";


var path    = require('path'),
    fs      = require('fs'),
    _       = require('../../lib/alloy/underscore'),
    CONST   = require('../../common/constants');


var Internal = {};

/**
 *
 * Get the alloy file for the given widget directory and file.
 *
 * @param  {String} widgetDir
 * @param  {String} file
 * @return {Array}
 *
 */
Internal.getAlloyFiles = function(widgetDir, file){

    var files       = [],
        searchPaths = ['VIEW','STYLE','CONTROLLER'];

    /// gets the name of the file without the widget ext
    file = file.split("\.").shift();

    _.each(searchPaths, function(fileType) {

        // get the path values for the file
        var fileTypeRoot = path.join(widgetDir, CONST.DIR[fileType]);
        var filename = file + '.' + CONST.FILE_EXT[fileType];
        var filepath = path.join(fileTypeRoot, filename);

        files.push(filepath);

    });

    return files;
};

/**
 *
 * Get the file info
 *
 * @param  {Array} files
 * @return {Object}
 *
 */
Internal.getFilesInfo = function(files){

    var result = {};
    _.each(files, function(file){
        var stats = fs.statSync(file);
        result[file] = stats.mtime.toString();
    });

    return result;
};

/**
 *
 * Get the persisted file info
 *
 * @param  {String} resourcesDir
 * @return {Object}
 *
 */
Internal.getPersistedFilesInfo = function(fileName){

    var data = "{}";
    try{
        data = fs.readFileSync(fileName, {});
    }catch(e){}

    return JSON.parse(data);

};

/**
 *
 * Persists files information
 *
 * @param  {String} resourcesDir
 * @param  {Object} stats
 * @return
 */
Internal.persistFilesInfo = function(fileName, stats){
    fs.writeFileSync(fileName, JSON.stringify(stats, 0, 4));
};


/**
 *
 * Compilation file tracker. Optimization for alloy compilation.
 *
 * @param {Object} compileConfig
 *
 */
var FileTracker = function(compileConfig){

    var fInfoFileName   = compileConfig.dir.resources + "/alloy/filechanges.json",
        ignoreTracking  = false;

    if(compileConfig.alloyConfig.deploytype != 'development'){
        ignoreTracking = true;
    }

    var stats   = Internal.getPersistedFilesInfo(fInfoFileName),
        changes = {};

    return {


        /**
         *
         * Check if the widget file has changed.
         *
         * @param  {String}  widgetDir
         * @param  {String}  file
         * @return {Boolean}
         *
         */
        hasChanged: function(widgetDir, file){

            /// Set to ignore tracking
            if(ignoreTracking){
                return true;
            }

            var files        = Internal.getAlloyFiles(widgetDir, file),
                currentStats = Internal.getFilesInfo(files);

            /// check each file for changes
            var changed = false;
            _.each(files, function(file){

                /// if no info about the file is found
                if(!stats[file]){
                    changed = true;
                    return false;
                }

                /// files have the same mtime
                if(stats[file] != currentStats[file]){
                    changed = true;
                    return false;
                }

            });

            /// merge the files stats with the persisted
            _.extend(changes, currentStats)

            return changed;

        },


        /**
         *
         * Persist the changes
         *
         * @return {[type]} [description]
         */
        save: function(){

            /// Set to ignore tracking
            if(ignoreTracking){
                return;
            }

            /// store the stats
            Internal.persistFilesInfo(fInfoFileName, _.extend({}, stats, changes));

        }

    }

};

module.exports = FileTracker;


